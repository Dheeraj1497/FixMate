class UserMailer < ApplicationMailer
  default from: 'noreply@fixmate.in'

  def welcome_email(user)
    @user = user
    @url  = 'http://localhost:3000/login'
    mail(to: @user.email, subject: 'Welcome to FixMate India!')
  end
end
