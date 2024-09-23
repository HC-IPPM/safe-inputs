// A type package for this plugin exists at @types/mongoose-unique-validator but, as of
// version 1.0.9, it really mangles mongoose's Model types. The nature of the plugin means
// that types aren't really relevant to us as a consumer anyway
declare module 'mongoose-unique-validator';
