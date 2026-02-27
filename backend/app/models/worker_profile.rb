class WorkerProfile < ApplicationRecord
  belongs_to :user
  belongs_to :city
  has_many :worker_services, dependent: :destroy
  has_many :services, through: :worker_services

  validates :experience, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :hourly_rate, presence: true, numericality: { greater_than_or_equal_to: 0 }
end