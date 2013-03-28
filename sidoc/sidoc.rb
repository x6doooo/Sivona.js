if ARGV.empty?
  src_path = '../src/sivona.'
  tar_path = './si-doc.md'
end

config = [
    'prefix',
    'util.js',
    'const.js',
    'init.js',
    'event.js',
    'canvas.js',
    'exports.js',
    'suffix'
]

config = config.map{|v| src_path + v}

files = []
config.each do |path|
  File.open(path, 'r') do |lines|
    lines.each do |line|
      files.push line
    end
  end
end

puts files.length
files = files.join

heads = {
    "@Title" => "#;",
    "@Link" => "<;>",
    "@Copyright" => "",
    "@License" => ""
}
tags = [
    "@Params",
    "@Info",
    "@Type",
    "@Usage",
    "@Return"
]
#puts files.scan(/\/\*![^*]*\*+(?:[^*\/][^*]*\*+)*\//)
