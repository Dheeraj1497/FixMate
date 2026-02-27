class AddPerformanceIndexesAndNotificationDefaults < ActiveRecord::Migration[8.0]
  def change
    change_column_default :notifications, :read, from: nil, to: false
    change_column_null :notifications, :read, false, false

    add_index :notifications, [:user_id, :read]
    add_index :job_requests, :status
    add_index :worker_profiles, :availability
  end
end
