import { encode as _encode, decode as _decode } from '@msgpack/msgpack';
import { SerializationError } from './errors';
import { SerializationType } from '../config';

export const decodeMsgpack = (data: Uint8Array): any => {
    try {
        return _decode(data);
    } catch (error) {
        throw new SerializationError('Failed to decode Msgpack data');
    }
};

export const encodeMsgpack = (data: any): Uint8Array => {
    try {
        return _encode(data);
    } catch (error) {
        throw new SerializationError('Failed to encode Msgpack data');
    }
};

export const decodeJson = (data: string): any => {
    try {
        return JSON.parse(data);
    } catch (error) {
        throw new SerializationError('Failed to decode JSON data');
    }
};

export const encodeJson = (data: any): string => {
    try {
        return JSON.stringify(data);
    } catch (error) {
        throw new SerializationError('Failed to encode JSON data');
    }
};

export const createDecode =
    (serializationType: SerializationType) =>
    (data: unknown): any => {
        switch (serializationType) {
            case 'json':
                return decodeJson(data as string);
            case 'msgpack':
                return decodeMsgpack(data as Uint8Array);
        }
    };

export const createEncode =
    (serializationType: SerializationType) =>
    (data: unknown): string | Uint8Array => {
        switch (serializationType) {
            case 'json':
                return encodeJson(data);
            case 'msgpack':
                return encodeMsgpack(data);
        }
    };
