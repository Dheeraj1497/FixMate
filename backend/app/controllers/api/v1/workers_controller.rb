class Api::V1::WorkersController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    workers = WorkerProfile.includes(:user, :city, :services)
    
    if params[:city_id].present?
      workers = workers.where(city_id: params[:city_id])
    end
    
    if params[:category_id].present?
      workers = workers.joins(:services).where(services: { category_id: params[:category_id] })
    end
    
    if params[:service_id].present?
      workers = workers.joins(:worker_services).where(worker_services: { service_id: params[:service_id] })
    end
    
    if params[:available].present?
      workers = workers.where(availability: ActiveModel::Type::Boolean.new.cast(params[:available]))
    end

    workers = workers.distinct
    total_count = workers.count
    paginated_workers = workers.limit(per_page).offset((page_number - 1) * per_page)

    render json: {
      data: paginated_workers.as_json(include: { user: { only: [:first_name, :last_name] }, city: { only: [:name] }, services: { only: [:id, :name] } }),
      meta: {
        page: page_number,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil,
        total_count: total_count
      }
    }
  end

  def show
    worker = WorkerProfile.includes(:user, :city, :services).find(params[:id])
    render json: worker.as_json(include: { user: { only: [:first_name, :last_name] }, city: { only: [:name] }, services: { only: [:id, :name] } })
  end

  def update_profile
    if current_user.worker?
      profile = current_user.worker_profile || current_user.build_worker_profile
      if profile.update(profile_params)
        # Update services if provided
        if params[:worker_profile][:service_ids].present?
          profile.service_ids = params[:worker_profile][:service_ids]
        end
        render json: profile.as_json(methods: [:service_ids], include: [:services, :city]), status: :ok
      else
        render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not authorized' }, status: :unauthorized
    end
  end

  # Return current user's worker profile (if any)
  def profile
    if current_user&.worker?
      profile = current_user.worker_profile
      if profile
        render json: profile.as_json(methods: [:service_ids], include: [:services, :city]), status: :ok
      else
        render json: { worker_profile: nil }, status: :ok
      end
    else
      render json: { error: 'Not authorized' }, status: :unauthorized
    end
  end

  def update_availability
    if current_user.worker?
      profile = current_user.worker_profile
      if profile&.update(availability: params[:availability])
        render json: { message: 'Availability updated', availability: profile.availability }, status: :ok
      else
        render json: { error: 'Profile not found or invalid' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not authorized' }, status: :unauthorized
    end
  end

  private

  def profile_params
    params.require(:worker_profile).permit(:city_id, :experience, :about, :hourly_rate, :availability)
  end

  def page_number
    page = params[:page].to_i
    page.positive? ? page : 1
  end

  def per_page
    requested = params[:per_page].to_i
    return 10 unless requested.positive?

    [requested, 50].min
  end
end
