/**
 * Single source for ladder ball keyframe timing (13 keyframes → 12 segments).
 * Keep in sync with `LadderRollingBall` in `Footer.tsx`.
 */
export const LADDER_PATH_TIMES = [
  0, 0.052, 0.098, 0.148, 0.198, 0.275, 0.36, 0.445, 0.518, 0.598, 0.698,
  0.815, 0.92, 1,
] as const;

export const LADDER_KF = {
  /** Index: ball leaves HOLOBOX shelf — red tint ramps up. */
  TAKEOFF: 8,
  APEX: 9,
  LAND_LIFE: 10,
  /** `pathProgress` fraction where red→orange blend finishes & spot smokes fade. */
  ORANGE_COMPLETE: 0.93,
} as const;

/** Progress value at takeoff keyframe — sync with `LADDER_PATH_TIMES[LADDER_KF.TAKEOFF]`. */
export const LADDER_TAKEOFF_P = LADDER_PATH_TIMES[LADDER_KF.TAKEOFF];
