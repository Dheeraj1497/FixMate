class JobMailer < ApplicationMailer
  def new_job_request
    @job = params[:job]
    @worker = @job.worker
    @customer = @job.customer
    @dashboard_url = ENV.fetch("WORKER_DASHBOARD_URL", "http://localhost:3000/worker/dashboard")

    mail(to: @worker.email, subject: "New FixMate job request")
  end
end
