###
#
# Prepare a copy of the wishable app for PhoneGap Build.
#
require 'optparse'
require 'fileutils'
include FileUtils

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: build.rb [options]"

  opts.on("-w", "--web-app", "Build for the web") do |w|
    options[:web] = w
  end
end.parse!

www         = "www"
build       = "www-for-build"
package     = "www-for-build.zip"
config_xml  = "#{ build }/config.xml"

puts "Deleting previous build"
FileUtils.remove_dir(build, true) if File.exists?(build)
File.unlink(package) if File.exists?(package)

puts "Copying files"
FileUtils.copy_entry(www, build)

puts "Removing cruft"
FileUtils.remove_dir("#{ build }/css/.sass-cache")
FileUtils.remove_dir("#{ build }/css/bourbon")
FileUtils.remove_dir("#{ build }/css/foundation")
system("rm #{ build }/css/*.scss")
system(" rm #{ build }/*.slim")

puts "Configuring settings for production use"

if options[:web]
  ####
  #
  # Updates specific to the web app
  #
  puts "Configuring for web app"

  index_html = "#{ build }/index.html"
  html = File.read(index_html)

  html.sub!('<script src="cordova.js"></script>', '')
  html.sub!('<script src="PushNotification.js"></script>', '')
  html.sub!('<script src="GAPlugin.js"></script>', '')
  html.sub!('<script src="cdv-plugin-fb-connect.js"></script>', '')
  html.sub!('<script src="facebook-js-sdk.js"></script>', '')

  File.open(index_html, 'w') { |f| f.puts html }

  File.unlink(config_xml)
else
  ####
  #
  # Updates specific to the smartphone app
  #
  puts "Configuring for PhoneGap Build"

  version = File.read('version').split("\n")[0].split('.')
  version[2] = version[2].to_i + 1

  xml = File.read(config_xml)
  xml.sub!(/version="[^\"]+"/, "version=\"#{ version.join('.') }\"")

  File.open(config_xml, 'w') { |f| f.puts xml }
  File.open('version', 'w') { |f| f.puts version.join('.') }
end

puts "Compressing"
system("zip -qr #{ package } #{ build }")

puts "Done"
