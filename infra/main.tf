terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.8.0"
    }
  }

  cloud {
    organization = "lostatc"

    workspaces {
      name = "indiefeed"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
