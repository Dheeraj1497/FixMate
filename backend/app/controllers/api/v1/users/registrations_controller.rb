class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      UserMailer.welcome_email(resource).deliver_now
      render json: {
        message: 'Signed up successfully.',
        user: resource
      }, status: :ok
    else
      render json: {
        message: "User couldn't be created successfully.",
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def sign_up(resource_name, resource)
    # This prevents Devise from trying to sign in using session
    # We will sign in using JWT via the login endpoint after registration
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name, :role)
  end
end
