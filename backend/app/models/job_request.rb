class JobRequest < ApplicationRecord
  MAX_IMAGE_SIZE = 5.megabytes
  ALLOWED_IMAGE_TYPES = %w[image/png image/jpeg image/jpg image/webp].freeze

  belongs_to :customer, class_name: 'User'
  belongs_to :worker, class_name: 'User'
  belongs_to :service

  has_many_attached :images

  enum :status, { pending: 0, accepted: 1, rejected: 2, completed: 3, cancelled: 4 }

  validates :description, presence: true
  validates :location, presence: true
  validates :scheduled_at, presence: true
  validate :worker_must_have_worker_role
  validate :customer_must_have_customer_role
  validate :service_must_belong_to_worker
  validate :validate_images

  private

  def worker_must_have_worker_role
    errors.add(:worker, "must have worker role") unless worker&.worker?
  end

  def customer_must_have_customer_role
    errors.add(:customer, "must have customer role") unless customer&.customer?
  end

  def service_must_belong_to_worker
    return if worker.blank? || service.blank? || worker.worker_profile.blank?
    return if worker.worker_profile.service_ids.include?(service_id)

    errors.add(:service, "is not offered by this worker")
  end

  def validate_images
    images.each do |image|
      errors.add(:images, "must be PNG, JPG, JPEG, or WEBP") unless ALLOWED_IMAGE_TYPES.include?(image.content_type)
      errors.add(:images, "size must be 5MB or less per file") if image.byte_size > MAX_IMAGE_SIZE
    end
  end
end
