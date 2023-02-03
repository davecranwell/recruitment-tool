import { useGoogleLogin } from '@react-oauth/google'
import { useFetcher } from '@remix-run/react'

import Button from './Button'
import googlelogo from '../../images/GoogleLogo.svg'

const GoogleLogin: React.FC = () => {
  const fetcher = useFetcher()

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      fetcher.submit({ googleResponse: JSON.stringify(codeResponse) }, { method: 'post' })
    },
    // The following causes the page to redirect in a way that I can't really use right now, but I prefer
    // the experience of redirection
    // ux_mode: 'redirect',
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar.events',
  })

  return (
    <Button
      color="secondary"
      width="full"
      text="Sign in with Google"
      icon={() => <img src={googlelogo} alt="" className="mr-2 flex h-6 w-6" />}
      onClick={() => googleLogin()}
    />
  )
}

export default GoogleLogin
