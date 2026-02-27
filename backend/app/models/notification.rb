class Notification < ApplicationRecord
  belongs_to :user

  validates :message, presence: true
  validates :read, inclusion: { in: [true, false] }

  before_validation :set_read_default, on: :create

  private

  def set_read_default
    self.read = false if read.nil?
  end
end
