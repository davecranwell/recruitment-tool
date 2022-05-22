export interface JwtTokenPayload {
  userId: number
  jwtid?: string
}

export interface MagicTokenPayload {
  email: string
}
