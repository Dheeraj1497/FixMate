class Api::V1::JobsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_job, only: [:show, :accept, :reject, :complete, :cancel]

  def create
    if current_user.customer?
      job = current_user.job_requests_as_customer.build(job_params)
      if job.save
        Notification.create(user: job.worker, message: "New job request from #{current_user.first_name}")
        JobMailer.with(job: job).new_job_request.deliver_later
        render json: job, status: :created
      else
        render json: { errors: job.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Only customers can create jobs' }, status: :forbidden
    end
  end

  def my_jobs
    if current_user.customer?
      jobs = current_user.job_requests_as_customer.includes(:worker, :service)
    else
      jobs = current_user.job_requests_as_worker.includes(:customer, :service)
    end
    render json: jobs.as_json(include: { customer: { only: [:first_name, :last_name] }, worker: { only: [:first_name, :last_name] }, service: { only: [:name] } })
  end

  def show
    unless (@job.customer_id == current_user.id) || (@job.worker_id == current_user.id)
      return render json: { error: 'Not authorized' }, status: :forbidden
    end

    images = @job.images.map do |image|
      Rails.application.routes.url_helpers.rails_blob_url(image, host: request.base_url)
    end

    render json: @job.as_json(
      include: {
        customer: { only: [:first_name, :last_name] },
        worker: { only: [:first_name, :last_name] },
        service: { only: [:name] }
      }
    ).merge(images: images)
  end

  def accept
    if current_user.worker? && @job.worker_id == current_user.id && @job.pending?
      @job.update(status: :accepted)
      Notification.create(user: @job.customer, message: "#{current_user.first_name} accepted your job request")
      render json: @job
    else
      render json: { error: 'Not authorized or invalid state' }, status: :unprocessable_entity
    end
  end

  def reject
    if current_user.worker? && @job.worker_id == current_user.id && @job.pending?
      @job.update(status: :rejected)
      Notification.create(user: @job.customer, message: "#{current_user.first_name} rejected your job request")
      render json: @job
    else
      render json: { error: 'Not authorized or invalid state' }, status: :unprocessable_entity
    end
  end

  def complete
    if current_user.worker? && @job.worker_id == current_user.id && @job.accepted?
      @job.update(status: :completed)
      
      profile = current_user.worker_profile
      profile.update(total_completed_jobs: profile.total_completed_jobs.to_i + 1) if profile

      Notification.create(user: @job.customer, message: "Your job by #{current_user.first_name} has been completed")
      render json: @job
    else
      render json: { error: 'Not authorized or invalid state' }, status: :unprocessable_entity
    end
  end

  def cancel
    if current_user.customer? && @job.customer_id == current_user.id && @job.pending?
      @job.update(status: :cancelled)
      Notification.create(user: @job.worker, message: "Job request from #{current_user.first_name} was cancelled")
      render json: @job
    else
      render json: { error: 'Not authorized or invalid state' }, status: :unprocessable_entity
    end
  end

  private

  def set_job
    @job = JobRequest.find(params[:id])
  end

  def job_params
    params.require(:job).permit(:worker_id, :service_id, :description, :scheduled_at, :location, images: [])
  end
end
