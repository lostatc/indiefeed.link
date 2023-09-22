resource "cloudflare_pages_project" "indiefeed" {
  account_id        = var.cloudflare_account_id
  name              = "indiefeed"
  production_branch = "main"

  build_config {
    build_command   = "npm install && npm run build"
    destination_dir = "build"
  }

  source {
    type = "github"

    config {
      owner                         = "lostatc"
      repo_name                     = "indiefeed.link"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["dev"]
    }
  }

  deployment_configs {
    production {
      environment_variables = {
        HUGO_VERSION = "0.104.0"
      }
    }

    preview {
      environment_variables = {
        HUGO_BASEURL = "/"
        HUGO_VERSION = "0.104.0"
      }
    }
  }
}
