class ApplicationController < ActionController::API
  before_action :set_default_format
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def set_default_format
    request.format = :json
  end

  def render_not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end
end
