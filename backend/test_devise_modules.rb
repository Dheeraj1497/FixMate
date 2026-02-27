require_relative 'config/environment'
puts "User devise modules: #{User.devise_modules.inspect}"
puts "Warden strategies: #{Warden::Strategies._strategies.keys.inspect}"
puts "Devise configuration default strategies: #{Devise.warden_config.default_strategies(scope: :user).inspect}" if Devise.respond_to?(:warden_config)
