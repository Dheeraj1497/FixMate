class CreateWorkerProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :worker_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :city, null: false, foreign_key: true
      t.integer :experience
      t.text :about
      t.decimal :hourly_rate
      t.boolean :availability
      t.integer :total_completed_jobs

      t.timestamps
    end
  end
end
