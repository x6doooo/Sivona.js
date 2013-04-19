class Src_loader
  attr_accessor :src_path, :file_name_list, :list
  def format_path
    @list = @file_name_list.map{|v| @src_path + v}
  end
  def load
    puts '--- load start'
    if @list.nil? 
      format_path
    end
    files = []
    @list.each do |path|
      File.open(path, 'r') do |lines|
        lines.each { |line| files.push line }
      end
      puts "--- #{path} loaded"
    end
    puts '--- load end'
    files.join
  end
end

class File_maker
  attr_accessor :content
  def export(f, c)
    File.open(f, 'w') do |file|
      file.write(c);
    end
    puts "--- export #{f} done"
  end
  def export_whole_file(f)
    export f, @content
  end
end

loader = Src_loader.new
loader.src_path = '../src/sivona.'
loader.file_name_list = %W{
    prefix
    util.js
    const.js
    init.js
    event.js
    animation.js
    canvas.js
    shapes.js
    exports.js
    suffix
}

loader.format_path

maker = File_maker.new
maker.content = loader.load
maker.export_whole_file '../src/sivona.js'

#whole_file = '../src/sivona.js'
#api_doc = './api.md'

=begin
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
=end

