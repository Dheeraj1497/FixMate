class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    data = {
      id: current_user.id,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      role: current_user.role
    }

    if current_user.worker?
      profile = current_user.worker_profile
      data[:city] = profile&.city&.name
    end

    render json: data
  end
end
