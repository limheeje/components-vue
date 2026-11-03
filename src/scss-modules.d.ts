declare module '*.module.scss' {
  const classes: {readonly [key: string]: string}
  export default classes
}

// side-effect CSS import (`import '~/assets/styles/tokens.css'`)
declare module '*.css'
