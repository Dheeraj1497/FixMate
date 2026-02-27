class City < ApplicationRecord
  has_many :worker_profiles, dependent: :nullify
  validates :name, presence: true, uniqueness: true
end