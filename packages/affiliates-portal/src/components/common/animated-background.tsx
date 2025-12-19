"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_aspect;

  const vec3 darkColor = vec3(0.118, 0.118, 0.141);
  const vec3 accentColor = vec3(0.451, 0.443, 0.988);
  const vec3 glowColor = vec3(0.804, 0.757, 1.0);

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float easeInOut(float t) {
    return t * t * (3.0 - 2.0 * t);
  }

  float lineDist(vec2 uv, float yStart, float yEnd, float time, float speed) {
    float baseY = mix(yStart, yEnd, uv.x);
    float noise1 = snoise(vec2(uv.x * 0.8 + time * speed * 0.08, time * 0.03));
    float noise2 = snoise(vec2(uv.x * 1.5 - time * speed * 0.05, time * 0.02));
    float wave = easeInOut(noise1 * 0.5 + 0.5) * 0.36 - 0.18;
    wave += easeInOut(noise2 * 0.5 + 0.5) * 0.16 - 0.08;
    return abs(uv.y - (baseY + wave));
  }

  float travelingGlow(float x, float time, float speed) {
    float pos = fract(time * speed);
    float dist = min(abs(x - pos), 1.0 - abs(x - pos));
    return smoothstep(0.08, 0.0, dist);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    float isMobile = step(u_aspect, 1.0);

    float y1Start = mix(0.22, 0.35, isMobile);
    float y1End = mix(0.82, 0.75, isMobile);
    float y2Start = mix(0.15, 0.25, isMobile);
    float y2End = mix(0.52, 0.55, isMobile);

    float dist1 = lineDist(uv, y1Start, y1End, u_time, 0.15);
    float dist2 = lineDist(uv, y2Start, y2End, u_time * 1.1, 0.12);

    float lineWidth = mix(0.003, 0.004, isMobile);
    float line1 = smoothstep(lineWidth, lineWidth * 0.3, dist1);
    float line2 = smoothstep(lineWidth, lineWidth * 0.3, dist2);

    float glow1 = travelingGlow(uv.x, u_time, 0.04);
    float glow2 = travelingGlow(uv.x, u_time + 12.5, 0.04);

    vec3 subtlePurple = accentColor * 0.4;
    vec3 lineColor1 = mix(subtlePurple, glowColor, glow1 * 0.9);
    vec3 lineColor2 = mix(subtlePurple, glowColor, glow2 * 0.9);

    float glowDist1 = smoothstep(0.015, 0.0, dist1) * (0.05 + glow1 * 0.5);
    float glowDist2 = smoothstep(0.015, 0.0, dist2) * (0.05 + glow2 * 0.5);

    vec3 color = vec3(0.0);
    color += lineColor1 * line1;
    color += lineColor2 * line2;
    color += mix(subtlePurple, glowColor, glow1 * 0.6) * glowDist1 * (1.0 - line1);
    color += mix(subtlePurple, glowColor, glow2 * 0.6) * glowDist2 * (1.0 - line2);

    float alpha = clamp(max(line1, line2) + glowDist1 + glowDist2, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const initWebGL = useCallback((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) {
      setIsSupported(false);
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) {
      setIsSupported(false);
      return;
    }

    const program = createProgram(gl, vs, fs);
    if (!program) {
      setIsSupported(false);
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const aspectLocation = gl.getUniformLocation(program, "u_aspect");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const startTime = performance.now();
    let firstFrame = true;

    const render = () => {
      const time = (performance.now() - startTime) / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform1f(aspectLocation, canvas.width / canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (firstFrame) {
        firstFrame = false;
        setIsReady(true);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    cleanupRef.current = () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (typeof requestIdleCallback !== "undefined") {
      const idleId = requestIdleCallback(() => initWebGL(canvas), { timeout: 2000 });
      return () => {
        cancelIdleCallback(idleId);
        cleanupRef.current?.();
      };
    } else {
      timeoutId = setTimeout(() => initWebGL(canvas), 100);
      return () => {
        clearTimeout(timeoutId);
        cleanupRef.current?.();
      };
    }
  }, [initWebGL]);

  if (!isSupported) {
    return (
      <svg
        className="animated-background"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d="M-100 820 Q480 750 960 550 Q1440 350 2020 180"
          stroke="rgba(115, 113, 252, 0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M-100 870 Q480 820 960 700 Q1440 580 2020 480"
          stroke="rgba(115, 113, 252, 0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
      style={{
        width: "100%",
        height: "100%",
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.8s ease-out",
      }}
    />
  );
}
