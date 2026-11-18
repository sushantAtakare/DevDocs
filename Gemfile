# frozen_string_literal: true

source "https://rubygems.org"

# DevDocs — Jekyll static site generator
gem "jekyll", "~> 4.4.1"

# Windows and JRuby do not include zoneinfo files by default
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance booster for watching directories on Windows
gem "wdm", "~> 0.1", :platforms => [:windows]

# HTTP parser for Jekyll on Ruby 3+ / Windows
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
