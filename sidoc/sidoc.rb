if ARGV.empty?
  src_path = '../src/sivona.'
  tar_path = './si-doc.md'
  whole_file = '../src/sivona.js'
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
#puts files.scan(/\/\*![^*]*\*+(?:[^*\/][^*]*\*+)*\//)
