require_relative 'config/environment'

user = User.first
puts "User: #{user.email}" if user
puts "Password valid? #{user.valid_password?('Dheeraj@1')}"

