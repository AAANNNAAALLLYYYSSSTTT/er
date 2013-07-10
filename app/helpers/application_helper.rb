module ApplicationHelper

  JSON_ESCAPE_MAP = {
    '\\'    => '\\\\',
    "\r\n"  => '\n',
    "\n"    => '\n',
    "\r"    => '\n',
    "\t"    => '\t',
    '"'     => '\\"'
  }

  def escape_json(string)
    string.gsub(/(\\|\r\n|[\n\r\t"])/) { JSON_ESCAPE_MAP[$1] }
  end

end
