import { useGoogleLogin } from '@react-oauth/google'
import { useFetcher } from '@remix-run/react'

import Button from './Button'
import googlelogo from '../../images/GoogleLogo.svg'

type Props = {
  text?: string
  extraData?: any
}

const GoogleLogin: React.FC<Props> = ({ text = 'Sign in with google', extraData = {} }) => {
  const fetcher = useFetcher()

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      fetcher.submit({ googleResponse: JSON.stringify(codeResponse), ...extraData }, { method: 'post' })
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
      text={text}
      icon={() => <img src={googlelogo} alt="" className="mr-2 flex h-6 w-6" />}
      onClick={() => googleLogin()}
    />
  )
}

export default GoogleLogin
