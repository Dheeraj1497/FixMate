class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  enum :role, { customer: 0, worker: 1 }

  validates :first_name, presence: true
  validates :last_name, presence: true

  has_one :worker_profile, dependent: :destroy
  has_many :job_requests_as_customer, class_name: 'JobRequest', foreign_key: 'customer_id', dependent: :destroy
  has_many :job_requests_as_worker, class_name: 'JobRequest', foreign_key: 'worker_id', dependent: :destroy
  has_many :notifications, dependent: :destroy
end