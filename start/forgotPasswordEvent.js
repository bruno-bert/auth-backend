const Event = use('Event')
const Mail = use('Mail')
const Env = use('Env')
//const Config = use('Config')

Event.on('forgot::password', async ({
  user,
  token
}) => {


  const mailSubject = 'Password reset'
  const mailTemplate = 'auth.emails.password'

  await Mail.send(mailTemplate, {
    token,
    user,
    appURL: Env.get('APP_URL')
  }, (message) => {
    message.to(user.email)
    message.from(Env.get('MAIL_FROM'))
      .subject(mailSubject)
  })
})
