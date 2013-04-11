if ARGV.empty?
  src_path = '../src/sivona.'
  tar_path = './si-doc.md'
  whole_file = '../src/sivona.js'
  api_doc = './api.md'
end

config = [
    'prefix',
    'util.js',
    'const.js',
    'init.js',
    'event.js',
    'animation.js',
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

files = files.join
File.open(whole_file, 'w') do |file|
  file.write(files);
end

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


files = files.scan(/\/\*![^Private][^*]*\*+(?:[^*\/][^*]*\*+)*\//)

files = files.map do |line|
  line = line.gsub(/^\s+|^\t+/, "")
  line = line.gsub(/\n/, "\n\n")
  line = line.gsub(/\/\*\!/, "===")
  line = line.gsub(/\*\//, "\n")
  line = line.gsub(/@Title:\s*/, "\#")
  line = line.gsub(/(@Link\:\s*)(.+$)/, '\\1<\\2>')
end

puts files.inspect

File.open(api_doc, 'w') do |file|
  file.write(files.join)
end

