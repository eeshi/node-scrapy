@{%
  const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
  const prune = d => flatten(d).filter(x => x !== null)
  const join = d => prune(d).join('')
%}

MAIN ->
    EXTENDED_QUERY {% id %}
  | SIMPLE_QUERY {% id %}

EXTENDED_QUERY -> CSS_COMBINATOR __ QUERY_EXTENSION _ {% d => ({
  selector: d[0],
  getter: d[2].getter,
  filters: d[2].filters
}) %}

SIMPLE_QUERY -> CSS_COMBINATOR {% d => ({
  selector: d[0],
  getter: null,
  filters: [],
})%}

QUERY_EXTENSION ->
    GETTER {% d => ({ getter: d[0], filters: [] }) %}
  | FILTER_LIST {% d => ({ getter: null, filters: d[0] }) %}
  | GETTER __ FILTER_LIST {% d => ({ getter: d[0], filters: d[2] }) %}

GETTER -> "=>" __ IDENTIFIER {% d => d[2] %}

FILTER_LIST ->
    FILTER
  | FILTER_LIST __ FILTER {% d => flatten([d[0], d[2]]) %}

FILTER -> "|" __ IDENTIFIER FILTER_ARG:* {% d => ({
  name: d[2],
  args: d[3]
}) %}

FILTER_ARG -> ":" VALUE {% d => d[1] %}

IDENTIFIER -> ID_START [a-zA-Z0-9_$]:* {% join %}

ID_START -> [a-zA-Z$_] {% id %}

VALUE ->
    NUMBER {% id %}
  | STRING {% id %}
  | LITERAL {% id %}

LITERAL ->
    NULL {% id %}
  | TRUE {% id %}
  | FALSE {% id %}
  | SYMBOL {% id %}

SYMBOL -> [a-zA-Z]:+ {% (d, loc, reject) => {
  const token = join(d)
  return ["null", "true", "false"].includes(token) ? reject : token
} %}


# CSS selector grammar

CSS_COMBINATOR ->
    SELECTOR_BODY {% join %}
  | CSS_COMBINATOR _ [><+~] _ SELECTOR_BODY {% join %}
  | CSS_COMBINATOR __ SELECTOR_BODY {% join %}

SELECTOR_BODY ->
  BASE_SELECTOR PSEUDO_ELEMENT_SELECTOR:? {% join %}
  | COMPOUND_SELECTOR PSEUDO_ELEMENT_SELECTOR:? {% join %}
  | BASE_SELECTOR COMPOUND_SELECTOR PSEUDO_ELEMENT_SELECTOR:? {% join %}

COMPOUND_SELECTOR ->
    MODIFIER_SELECTOR {% join %}
  | COMPOUND_SELECTOR MODIFIER_SELECTOR {% join %}

MODIFIER_SELECTOR ->
    ID_SELECTOR {% join %}
  | CLASS_SELECTOR {% join %}
  | ATTRIBUTE_VALUE_SELECTOR {% join %}
  | ATTRIBUTE_PRESENCE_SELECTOR {% join %}
  | PSEUDO_CLASS_SELECTOR {% join %}

BASE_SELECTOR ->
  TYPE_SELECTOR {% join %}
  | UNIVERSAL_SELECTOR {% join %}

UNIVERSAL_SELECTOR -> "*"

TYPE_SELECTOR -> ATTRIBUTE_NAME {% join %}

ID_SELECTOR -> "#" ATTRIBUTE_NAME {% join %}

CLASS_SELECTOR -> "." CLASS_NAME {% join %}

CLASS_NAME ->
    NAME_START {% join %}
  | "-" NAME_START NAME_BODY {% join %}
  | NAME_START NAME_BODY {% join %}

ATTRIBUTE_PRESENCE_SELECTOR -> "[" ATTRIBUTE_NAME "]" {% join %}

ATTRIBUTE_VALUE_SELECTOR -> "[" ATTRIBUTE_NAME ATTRIBUTE_OPERATOR ATTRIBUTE_VALUE "]" {% join %}

ATTRIBUTE_NAME ->
    NAME_START {% join %}
  | NAME_START NAME_BODY {% join %}

ATTRIBUTE_OPERATOR ->
    "="
  | "~="
  | "|="
  | "^="
  | "$="
  | "*="

ATTRIBUTE_VALUE ->
    UNQUOTED_ATTRIBUTE_VALUE {% join %}
  | STRING {% join %}

UNQUOTED_ATTRIBUTE_VALUE -> [^\[\]"',= ]:+ {% join %}

PSEUDO_ELEMENT_SELECTOR -> "::" PSEUDO_SELECTOR_NAME {% join %}

PSEUDO_CLASS_SELECTOR ->
    ":" PSEUDO_SELECTOR_NAME {% join %}
  | ":" PSEUDO_SELECTOR_NAME "(" [^\(\)]:* ")" {% join %}

PSEUDO_SELECTOR_NAME -> [a-zA-Z] NAME_BODY {% join %}

NAME_START -> [_a-zA-Z] {% join %}

NAME_BODY -> [a-zA-Z0-9-_]:+ {% join %}


# Basic literal types

NUMBER -> "-":? ("0" | [1-9] [0-9]:* ) ("." [0-9]:+ ):? ( [eE] [+-]:? [0-9]:+):? {%  d => {
  return Number.parseFloat(
    join(d)
  )
} %}

STRING ->
    SINGLE_QUOTE_STRING {% id %}
  | DOUBLE_QUOTE_STRING {% id %}

SINGLE_QUOTE_STRING -> "'"  SINGLE_QUOTE_CHAR:* "'"  {% d => join(d[1]) %}

DOUBLE_QUOTE_STRING -> "\""  DOUBLE_QUOTE_CHAR:* "\""  {% d => join(d[1]) %}

SINGLE_QUOTE_CHAR ->
    ESCAPED_CHAR {% id %}
  | [^'\\] {% id %}
  | "\\'" {% () => "'" %}

DOUBLE_QUOTE_CHAR ->
    ESCAPED_CHAR {% id %}
  | [^"\\] {% id %}
  | "\\\"" {% () => '"' %}

ESCAPED_CHAR ->
    "\\\\" {% () => '\\' %}
  | "\\/" {% () => '/' %}
  | "\\n" {% () => '\n' %}
  | "\\b" {% () => '\b' %}
  | "\\f" {% () => '\f' %}
  | "\\r" {% () => '\r' %}
  | "\\t" {% () => '\t' %}
  | "\\u" HEX HEX HEX HEX {% d => {
    const point = Number.parseInt(join(d.slice(1)), 16)
    if (point === 92) return '\\'
    return String.fromCodePoint(point)
  } %}

HEX -> [0-9a-fA-F] {% id %}

NULL -> "null" {% () => null %}

TRUE -> "true" {% () => true %}

FALSE -> "false" {% () => false %}

_ -> WSCHAR:* {% join %}

__ -> WSCHAR:+ {% join %}

WSCHAR -> [ \t\n\v\f] {% join %}
