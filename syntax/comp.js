// const Tokens = {
//     EQUALS: /=/i,
//     COLON: /:/i,
//     SEMICOLON: /;/i,
//     PLUS: /\+/i,
//     MINUS: /\-/i,
//     MULTIPLY: /\*/i,
//     DIVIDE: /\//i,
//     STRING: /".*"/i,
//     NUMBER: /\d/,
// }
// function Token(value) {
//     return {lexeme: value, token_type: new Promise((resolve, reject) => {
//         Object.keys(Tokens).forEach(key => {
//             try {
//                 if(Tokens[key].test(value)) {
//                     resolve(key)
//                 }                
//             } catch (error) {
//                 console.error(error, key, value)
//             }
//         })
//         resolve('IDENTIFIER')  
//     })}
// }
// async function Tokenizer(input) {
//     let output = []
//     for(let i = 0; i < input.length; i++) {
//         let token = await Token(input[i])
//         output.push({[token]: input[i]})
//     }
//     return output
// }

// function Parser(tokens) {
//     return tokens
// }


// console.log(...Parser(await Tokenizer('hello : constant, string = wow, this works?;')))


const TokenType = {
    "NumberLiteral": "NumberLiteral",
    "Identifier": "Identifier",
    "Equal": "Equal",
    "Plus": "Plus",
    "Minus": "Minus",
    "Star": "Star",
    "Slash": "Slash",
    "LeftParen": "LeftParen",
    "RightParen": "RightParen",
    "LeftCurBra": "LeftCurBra",
    "RightCurBra": "RightCurBra",
    "Comma": "Comma",
    "Semicolon": "Semicolon",
    "Colon": "Colon",
    "Newline": "Newline",
    "Whitespace": "Whitespace",
    "String": "String",
}

const Token = {
    token_type: TokenType,
    lexeme: String,
}

export function tokenizer(source_code) {
    let position = 0

    let result = [];

    function match(current_char) {
        switch (current_char) {
            case "=":
                return TokenType.Equal
                break;
            case "+":
                return TokenType.Plus
                break;
            case "-":
                return TokenType.Minus
                break;
            case "*":
                return TokenType.Star
                break;
            case "/":
                return TokenType.Slash
                break;
            case "(":
                return TokenType.LeftParen
                break;
            case ")":
                return TokenType.RightParen
                break;
            case "{":
                return TokenType.LeftCurBra
                break;
            case "}":
                return TokenType.RightCurBra
                break;
            case ",":
                return TokenType.Comma
                break;
            case ";":
                return TokenType.Semicolon
                break;
            case ":":
                return TokenType.Colon
                break;
            case "\n":
                return TokenType.Newline
                break;
            case " ":
                return TokenType.Whitespace
                break;
            default:
                return null
                break;
        }
    }
    while (position < source_code.length) {
        let current_char = source_code[position]

        const _match = match(current_char)
        if (_match != null) {
            result.push({
                token_type: match(current_char),
                lexeme: current_char
            })
        }
        if (/[0-9]+/.test(current_char)) {
            let number_lexeme = current_char
            position++
            while (position < source_code.length) {
                let next_char = source_code[position]

                if (next_char == " " || next_char == "\n" || next_char == ")") {
                    break
                }

                if (/[0-9]+/.test(next_char)) {
                    number_lexeme += next_char
                }
                else {
                    console.error("Invalid character: ", next_char)
                }
                position++
            }
            result.push({
                token_type: TokenType.NumberLiteral,
                lexeme: number_lexeme
            })
            continue
        }
        current_char = source_code[position]
        if (current_char == '"') {
            let string_lexeme = '"'
            position++
            while (position < source_code.length) {
                let next_char = source_code[position]
                if (next_char == '"') {
                    string_lexeme += next_char
                    position++
                    break
                }
                string_lexeme += next_char
                position++
            }
            result.push({
                token_type: TokenType.String,
                lexeme: string_lexeme
            })
            continue
        }
        current_char = source_code[position]
        if (/[a-zA-Z_]+/.test(current_char)) {
            let identifier_lexeme = current_char
            position++
            while (position < source_code.length) {
                let next_char = source_code[position]
                if (/[a-zA-Z_0-9]+/.test(next_char)) {
                    identifier_lexeme += next_char
                }
                else {
                    break
                }
                position++
            }
            result.push({
                token_type: TokenType.Identifier,
                lexeme: identifier_lexeme
            })
            continue
        }
        position++
    }
    return result
}

export function secondTokenizer(tokens) {
    // console.log(tokens)
    let result = []
    let i = 0
    while (i < tokens.length) {
        // console.log(tokens[i])
        switch (tokens[i].token_type) {
            case "Colon":
                result.push(tokens[i])
                i++
                while (!(tokens[i].token_type == "Equal" || tokens[i].token_type == "Colon")) {
                    if (tokens[i].token_type != "Comma") tokens[i].token_type = "Type"
                    result.push(tokens[i])
                    i++
                }
                if (tokens[i].token_type == "Equal") i--
                else result.push(tokens[i])
                break;
            case "Slash":
                if (tokens[i+1].token_type == "Slash") {
                    tokens[i].token_type = "Comment"
                    result.push(tokens[i])
                    i++
                    while (!(tokens[i] == undefined || tokens[i].token_type == "Newline")) {
                        tokens[i].token_type = "Comment"
                        result.push(tokens[i])
                        i++
                    }
                    result.push(tokens[i])
                    break;
                }
            default:
                result.push(tokens[i])
                break;
        }
        i++
    }
    return result
}

const Expr = {
    Assignment(AssignmentImpl) { },
    BinaryOperation(BinaryOpImpl) { },
    Number(NumberImp) { },
    Variable(VariableImpl) { },
}

const VariableImpl = {
    name: Token,
}

const AssignmentImpl = {
    target: VariableImpl,
    value: Expr
}

const BinaryOpImpl = {
    lhs: Expr,
    operation: String,
    rhs: Expr,
}

const NumberImp = {
    value: Number,
    token: Token
}

function parse(tokens) {
    // tokens.reverse()

    let result = []

    while (tokens.length > 0) {
        let expr = parse_expr(tokens)

        expect(TokenType.Newline, tokens)

        result.push(expr)
    }

    return result
}

function parse_expr(tokens) {
    return parse_assignment(tokens)
}

function parse_assignment(tokens) {
    if (tokens.length > 1 && tokens[tokens.length - 2].token_type == TokenType.Equal) {
        let variable = parse_variable(tokens)
        expect(TokenType.Equal, tokens)
        let value = parse_expr(tokens)

        return { target: variable, value: value }
    } else {
        return parse_term(tokens)
    }
}

function parse_variable(tokens) {
    let token = tokens.pop()
    if (token.token_type == TokenType.Identifier) {
        return { name: token }
    } else {
        throw new Error(`Expected identifier, got ${token.token_type}`)
    }
}

function parse_term(tokens) {
    let result = parse_factor(tokens)

    while (tokens.length > 0) {
        let next_token = tokens[tokens.length - 1]
        if (next_token.token_type == TokenType.Plus || next_token.token_type == TokenType.Minus) {
            let op_token = tokens.pop()
            let rhs = parse_factor(tokens)

            result = { lhs: result, operation: op_token, rhs: rhs }
        }
    }

    return result
}

function parse_factor(tokens) {
    let result = parse_primary(tokens)

    while (tokens.length > 1) {
        let next_token = tokens[tokens.length - 1]
        if (next_token.token_type == TokenType.Star || next_token.token_type == TokenType.Slash) {
            let op_token = tokens.pop()
            let rhs = parse_primary(tokens)

            result = { lhs: result, operation: op_token, rhs: rhs }
        }
    }

    return result
}

function parse_primary(tokens) {
    let token = tokens.pop()
    switch (token.token_type) {
        case TokenType.NumberLiteral:
            return {
                value: parse_number(token.lexeme),
                token,
            }
            break;
        case TokenType.Identifier:
            return { name: token }
            break;
        case TokenType.LeftParen:
            let expr = parse_expr(tokens)
            expect(TokenType.RightParen, tokens)
            return expr
            break;

        default:
            throw new Error(`Unexpected token type: ${token.token_type}`)
            break;
    }
}

function parse_number(lexeme) {
    return Number(lexeme)
}

function expect(expected, tokens) {
    const rem = tokens.shift()

    if (rem.token_type != undefined) {
        return undefined
    }
    if (rem.token_type != expected) {
        throw new Error(`expected ${expected}, got ${rem.token_type}`)
    }

    return rem
}

// const exampleProgram =
// `a = 2
// b = 32
// c = a * 2 + b - 7`
// // `
// // a_123 = 123
// // print(a)
// // `
// // `
// // hello : constant, string = "wow, this works?";
// // `

// let tokens = tokenizer(exampleProgram)

// let exprs = parse(tokens)

// console.log(...exprs)