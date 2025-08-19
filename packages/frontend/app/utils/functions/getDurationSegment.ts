export const getDurationSegment = (
    timeOfSubmission: number,
    timeOfCompletion: number,
) => {
    const duration = timeOfCompletion - timeOfSubmission;
    const durationSeconds = duration / 1000;
    const durationSegment =
        durationSeconds < 0.2
            ? '< 0.2s'
            : durationSeconds < 0.5
              ? '< 0.5s'
              : durationSeconds < 1
                ? '< 1s'
                : durationSeconds < 2
                  ? '< 2s'
                  : durationSeconds < 5
                    ? '< 5s'
                    : durationSeconds < 10
                      ? '< 10s'
                      : durationSeconds < 15
                        ? '< 15s'
                        : durationSeconds < 20
                          ? '< 20s'
                          : durationSeconds < 25
                            ? '< 25s'
                            : durationSeconds < 30
                              ? '< 30s'
                              : durationSeconds < 35
                                ? '< 35s'
                                : durationSeconds < 40
                                  ? '< 40s'
                                  : durationSeconds < 45
                                    ? '< 45s'
                                    : durationSeconds < 50
                                      ? '< 50s'
                                      : durationSeconds < 55
                                        ? '< 55s'
                                        : durationSeconds < 60
                                          ? '< 1m'
                                          : durationSeconds < 120
                                            ? '< 2m'
                                            : durationSeconds < 300
                                              ? '< 5m'
                                              : durationSeconds < 600
                                                ? '< 10m'
                                                : durationSeconds < 900
                                                  ? '< 15m'
                                                  : durationSeconds < 1800
                                                    ? '< 30m'
                                                    : durationSeconds < 3600
                                                      ? '< 1h'
                                                      : durationSeconds < 7200
                                                        ? '< 2h'
                                                        : durationSeconds <
                                                            86400
                                                          ? '< 1d'
                                                          : 'slow';
    return durationSegment;
};
