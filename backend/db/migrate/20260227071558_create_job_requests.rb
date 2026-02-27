class CreateJobRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :job_requests do |t|
      t.references :customer, null: false, foreign_key: { to_table: :users }
      t.references :worker, null: false, foreign_key: { to_table: :users }
      t.references :service, null: false, foreign_key: true
      t.text :description
      t.integer :status, default: 0
      t.datetime :scheduled_at
      t.string :location

      t.timestamps
    end
  end
end
