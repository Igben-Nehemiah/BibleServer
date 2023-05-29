export interface User {
  _id?: string
  name?: string
  email: string
  password?: string
  isTwoFactorAuthenticationEnabled?: boolean
  twoFactorAuthenticationCode?: string
}
