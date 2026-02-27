class Service < ApplicationRecord
  belongs_to :category
  has_many :worker_services, dependent: :destroy
  has_many :worker_profiles, through: :worker_services

  validates :name, presence: true
  validates :base_price, presence: true, numericality: { greater_than_or_equal_to: 0 }
end