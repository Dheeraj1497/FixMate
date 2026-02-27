class Api::V1::NotificationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_notification, only: [:mark_read]

  def index
    notifications = current_user.notifications.order(created_at: :desc).limit(limit_param)
    render json: notifications
  end

  def unread_count
    render json: { unread_count: current_user.notifications.where(read: false).count }
  end

  def mark_read
    if @notification.update(read: true)
      render json: @notification, status: :ok
    else
      render json: { errors: @notification.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_notification
    @notification = current_user.notifications.find(params[:id])
  end

  def limit_param
    limit = params[:limit].to_i
    return 20 unless limit.positive?

    [limit, 100].min
  end
end
