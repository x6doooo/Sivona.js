class Src_loader
  attr_accessor :src_path, :file_name_list, :list

  def format_path
    @list = @file_name_list.map{|v| @src_path + v}
  end

  def load
    files = []
    puts '--- load start'
    if @list.nil? 
      format_path
    end
    @list.each{ |path|
      file = open(path)
      files << file.read
      file.close
      puts "--- #{path} loaded"
    }
    puts '--- load end'
    files.join
  end
end

class File_maker
  attr_accessor :content, :api_doc
  def format_api_doc
    isUsage = false
    @api_doc = @content.scan(/\/\*![^Private][^*]*\*+(?:[^*\/][^*]*\*+)*\//)
    @api_doc.map!{|line|
      line = line.gsub(/^\s+|^\t+/, "")
        .gsub(/(^[@-])/, "\n\\1")
        .gsub(/\/\*\!/, "===")
        .gsub(/\*\//, "\n")
        .gsub(/@Title:\s*/, "#")
        .gsub(/(@Link\:\s*)(.+$)/, '\\1<\\2>')
        .gsub(/@Name:\s*/, "###")
        .gsub(/(@Usage:.*\n)/, "\\1\n```\n")
        .gsub(/(^\|.*\n*)(^[^\|])/, "\\1```\\2")
        .gsub(/^\|/, '')
    }
    @api_doc = @api_doc.join
  end

  def export_api_doc(f)
    if @api_doc.nil?
      format_api_doc
    end
    export(f, @api_doc)
  end

  def export(f, c)
    File.open(f, 'w') do |file|
      file.write(c)
    end
    puts "--- export #{f} done"
  end

  def export_whole_file(f)
    export f, @content
  end
end

loader = Src_loader.new
loader.src_path = '../src/sivona.'
loader.file_name_list = %W(
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
)

maker = File_maker.new
maker.content = loader.load

maker.export_whole_file '../src/sivona.js'
maker.export_api_doc './api.md'

