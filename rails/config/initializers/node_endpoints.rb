
Rails.application.config.node_endpoints = YAML.load_file(Rails.root.join('config', 'node_endpoints.yml'))[Rails.env]