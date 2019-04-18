//const Config = use('Config')
const Event = use('Event')
const Mail = use('Mail')
const Env = use('Env')
const Config = use('Config')


Event.on('user::created', async ({
  user,
  token
}) => {

  /* Sends Mail on new account */
  const activationRequired = Config.get('auth.activationRequired')
  const mailSubject = 'Account Activation'
  const mailTemplate = activationRequired ? 'auth.emails.activation-mail' : 'auth.emails.welcome-mail'
  const encodedToken = encodeURIComponent(token)


  await Mail.send(mailTemplate, {
    appName: Env.get('APP_NAME'),
    appURL: Env.get('APP_URL'),
    user,
    token: encodedToken,
  }, (message) => {
    message.to(user.email)
    message.from(Env.get('MAIL_FROM'))
      .subject(mailSubject)
  })

})
