redis_config = YAML.load_file(Rails.root.join('config/redis.yml')).symbolize_keys
dflt = redis_config[:default].symbolize_keys
cnfg = dflt.merge(redis_config[Rails.env.to_sym].symbolize_keys) if redis_config[Rails.env.to_sym]

$redis = Redis.new(cnfg)
$redis.flushdb if Rails.env == 'test'

