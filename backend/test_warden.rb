require_relative 'config/environment'

user_count = User.count
puts "User count: #{user_count}"

auth_hash = { email: 'dheeraj@gmail.com' }
found_user = User.find_for_database_authentication(auth_hash)
puts "Found User: #{found_user.inspect}"
puts "Password present: #{'Dheeraj@1'.present?}"
puts "Valid password: #{found_user&.valid_password?('Dheeraj@1')}"

