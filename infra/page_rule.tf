resource "cloudflare_page_rule" "www_forward" {
  zone_id = data.cloudflare_zone.indiefeed.id
  target = "www.indiefeed.link/*"
  priority = 1

  actions {
    forwarding_url {
      url = "https://indiefeed.link/$1"
      status_code = 301
    }
  }
}
