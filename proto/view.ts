export interface SegmentConfig {
  page_size?: Long;
  total?: Long;
}

export function encodeSegmentConfig(message: SegmentConfig): Uint8Array {
  let bb = popByteBuffer();
  _encodeSegmentConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeSegmentConfig(message: SegmentConfig, bb: ByteBuffer): void {
  // optional int64 page_size = 1;
  let $page_size = message.page_size;
  if ($page_size !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $page_size);
  }

  // optional int64 total = 2;
  let $total = message.total;
  if ($total !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $total);
  }
}

export function decodeSegmentConfig(binary: Uint8Array): SegmentConfig {
  return _decodeSegmentConfig(wrapByteBuffer(binary));
}

function _decodeSegmentConfig(bb: ByteBuffer): SegmentConfig {
  let message: SegmentConfig = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int64 page_size = 1;
      case 1: {
        message.page_size = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 total = 2;
      case 2: {
        message.total = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface FlagConfig {
  rec_flag?: number;
  rec_text?: string;
  rec_switch?: number;
}

export function encodeFlagConfig(message: FlagConfig): Uint8Array {
  let bb = popByteBuffer();
  _encodeFlagConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeFlagConfig(message: FlagConfig, bb: ByteBuffer): void {
  // optional int32 rec_flag = 1;
  let $rec_flag = message.rec_flag;
  if ($rec_flag !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($rec_flag));
  }

  // optional string rec_text = 2;
  let $rec_text = message.rec_text;
  if ($rec_text !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $rec_text);
  }

  // optional int32 rec_switch = 3;
  let $rec_switch = message.rec_switch;
  if ($rec_switch !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($rec_switch));
  }
}

export function decodeFlagConfig(binary: Uint8Array): FlagConfig {
  return _decodeFlagConfig(wrapByteBuffer(binary));
}

function _decodeFlagConfig(bb: ByteBuffer): FlagConfig {
  let message: FlagConfig = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 rec_flag = 1;
      case 1: {
        message.rec_flag = readVarint32(bb);
        break;
      }

      // optional string rec_text = 2;
      case 2: {
        message.rec_text = readString(bb, readVarint32(bb));
        break;
      }

      // optional int32 rec_switch = 3;
      case 3: {
        message.rec_switch = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface WebPlayerConfig {
  dm_switch?: boolean;
  ai_switch?: boolean;
  ai_level?: number;
  display_top?: boolean;
  display_scroll?: boolean;
  display_bottom?: boolean;
  display_color?: boolean;
  display_special?: boolean;
  prevent_shade?: boolean;
  dmask?: boolean;
  opacity?: number;
  dm_area?: number;
  speed_plus?: number;
  font_size?: number;
  screen_sync?: boolean;
  speed_sync?: boolean;
  font_family?: string;
  bold?: boolean;
  font_border?: number;
  draw_type?: string;
}

export function encodeWebPlayerConfig(message: WebPlayerConfig): Uint8Array {
  let bb = popByteBuffer();
  _encodeWebPlayerConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeWebPlayerConfig(message: WebPlayerConfig, bb: ByteBuffer): void {
  // optional bool dm_switch = 1;
  let $dm_switch = message.dm_switch;
  if ($dm_switch !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $dm_switch ? 1 : 0);
  }

  // optional bool ai_switch = 2;
  let $ai_switch = message.ai_switch;
  if ($ai_switch !== undefined) {
    writeVarint32(bb, 16);
    writeByte(bb, $ai_switch ? 1 : 0);
  }

  // optional int32 ai_level = 3;
  let $ai_level = message.ai_level;
  if ($ai_level !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($ai_level));
  }

  // optional bool display_top = 4;
  let $display_top = message.display_top;
  if ($display_top !== undefined) {
    writeVarint32(bb, 32);
    writeByte(bb, $display_top ? 1 : 0);
  }

  // optional bool display_scroll = 5;
  let $display_scroll = message.display_scroll;
  if ($display_scroll !== undefined) {
    writeVarint32(bb, 40);
    writeByte(bb, $display_scroll ? 1 : 0);
  }

  // optional bool display_bottom = 6;
  let $display_bottom = message.display_bottom;
  if ($display_bottom !== undefined) {
    writeVarint32(bb, 48);
    writeByte(bb, $display_bottom ? 1 : 0);
  }

  // optional bool display_color = 7;
  let $display_color = message.display_color;
  if ($display_color !== undefined) {
    writeVarint32(bb, 56);
    writeByte(bb, $display_color ? 1 : 0);
  }

  // optional bool display_special = 8;
  let $display_special = message.display_special;
  if ($display_special !== undefined) {
    writeVarint32(bb, 64);
    writeByte(bb, $display_special ? 1 : 0);
  }

  // optional bool prevent_shade = 9;
  let $prevent_shade = message.prevent_shade;
  if ($prevent_shade !== undefined) {
    writeVarint32(bb, 72);
    writeByte(bb, $prevent_shade ? 1 : 0);
  }

  // optional bool dmask = 10;
  let $dmask = message.dmask;
  if ($dmask !== undefined) {
    writeVarint32(bb, 80);
    writeByte(bb, $dmask ? 1 : 0);
  }

  // optional float opacity = 11;
  let $opacity = message.opacity;
  if ($opacity !== undefined) {
    writeVarint32(bb, 93);
    writeFloat(bb, $opacity);
  }

  // optional int32 dm_area = 12;
  let $dm_area = message.dm_area;
  if ($dm_area !== undefined) {
    writeVarint32(bb, 96);
    writeVarint64(bb, intToLong($dm_area));
  }

  // optional float speed_plus = 13;
  let $speed_plus = message.speed_plus;
  if ($speed_plus !== undefined) {
    writeVarint32(bb, 109);
    writeFloat(bb, $speed_plus);
  }

  // optional float font_size = 14;
  let $font_size = message.font_size;
  if ($font_size !== undefined) {
    writeVarint32(bb, 117);
    writeFloat(bb, $font_size);
  }

  // optional bool screen_sync = 15;
  let $screen_sync = message.screen_sync;
  if ($screen_sync !== undefined) {
    writeVarint32(bb, 120);
    writeByte(bb, $screen_sync ? 1 : 0);
  }

  // optional bool speed_sync = 16;
  let $speed_sync = message.speed_sync;
  if ($speed_sync !== undefined) {
    writeVarint32(bb, 128);
    writeByte(bb, $speed_sync ? 1 : 0);
  }

  // optional string font_family = 17;
  let $font_family = message.font_family;
  if ($font_family !== undefined) {
    writeVarint32(bb, 138);
    writeString(bb, $font_family);
  }

  // optional bool bold = 18;
  let $bold = message.bold;
  if ($bold !== undefined) {
    writeVarint32(bb, 144);
    writeByte(bb, $bold ? 1 : 0);
  }

  // optional int32 font_border = 19;
  let $font_border = message.font_border;
  if ($font_border !== undefined) {
    writeVarint32(bb, 152);
    writeVarint64(bb, intToLong($font_border));
  }

  // optional string draw_type = 20;
  let $draw_type = message.draw_type;
  if ($draw_type !== undefined) {
    writeVarint32(bb, 162);
    writeString(bb, $draw_type);
  }
}

export function decodeWebPlayerConfig(binary: Uint8Array): WebPlayerConfig {
  return _decodeWebPlayerConfig(wrapByteBuffer(binary));
}

function _decodeWebPlayerConfig(bb: ByteBuffer): WebPlayerConfig {
  let message: WebPlayerConfig = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool dm_switch = 1;
      case 1: {
        message.dm_switch = !!readByte(bb);
        break;
      }

      // optional bool ai_switch = 2;
      case 2: {
        message.ai_switch = !!readByte(bb);
        break;
      }

      // optional int32 ai_level = 3;
      case 3: {
        message.ai_level = readVarint32(bb);
        break;
      }

      // optional bool display_top = 4;
      case 4: {
        message.display_top = !!readByte(bb);
        break;
      }

      // optional bool display_scroll = 5;
      case 5: {
        message.display_scroll = !!readByte(bb);
        break;
      }

      // optional bool display_bottom = 6;
      case 6: {
        message.display_bottom = !!readByte(bb);
        break;
      }

      // optional bool display_color = 7;
      case 7: {
        message.display_color = !!readByte(bb);
        break;
      }

      // optional bool display_special = 8;
      case 8: {
        message.display_special = !!readByte(bb);
        break;
      }

      // optional bool prevent_shade = 9;
      case 9: {
        message.prevent_shade = !!readByte(bb);
        break;
      }

      // optional bool dmask = 10;
      case 10: {
        message.dmask = !!readByte(bb);
        break;
      }

      // optional float opacity = 11;
      case 11: {
        message.opacity = readFloat(bb);
        break;
      }

      // optional int32 dm_area = 12;
      case 12: {
        message.dm_area = readVarint32(bb);
        break;
      }

      // optional float speed_plus = 13;
      case 13: {
        message.speed_plus = readFloat(bb);
        break;
      }

      // optional float font_size = 14;
      case 14: {
        message.font_size = readFloat(bb);
        break;
      }

      // optional bool screen_sync = 15;
      case 15: {
        message.screen_sync = !!readByte(bb);
        break;
      }

      // optional bool speed_sync = 16;
      case 16: {
        message.speed_sync = !!readByte(bb);
        break;
      }

      // optional string font_family = 17;
      case 17: {
        message.font_family = readString(bb, readVarint32(bb));
        break;
      }

      // optional bool bold = 18;
      case 18: {
        message.bold = !!readByte(bb);
        break;
      }

      // optional int32 font_border = 19;
      case 19: {
        message.font_border = readVarint32(bb);
        break;
      }

      // optional string draw_type = 20;
      case 20: {
        message.draw_type = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CommandDanmaku {
  id?: Long;
  oid?: Long;
  mid?: Long;
  command?: string;
  content?: string;
  progress?: number;
  ctime?: string;
  mtime?: string;
  extra?: string;
  id_str?: string;
}

export function encodeCommandDanmaku(message: CommandDanmaku): Uint8Array {
  let bb = popByteBuffer();
  _encodeCommandDanmaku(message, bb);
  return toUint8Array(bb);
}

function _encodeCommandDanmaku(message: CommandDanmaku, bb: ByteBuffer): void {
  // optional int64 id = 1;
  let $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $id);
  }

  // optional int64 oid = 2;
  let $oid = message.oid;
  if ($oid !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $oid);
  }

  // optional int64 mid = 3;
  let $mid = message.mid;
  if ($mid !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $mid);
  }

  // optional string command = 4;
  let $command = message.command;
  if ($command !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $command);
  }

  // optional string content = 5;
  let $content = message.content;
  if ($content !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $content);
  }

  // optional int32 progress = 6;
  let $progress = message.progress;
  if ($progress !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($progress));
  }

  // optional string ctime = 7;
  let $ctime = message.ctime;
  if ($ctime !== undefined) {
    writeVarint32(bb, 58);
    writeString(bb, $ctime);
  }

  // optional string mtime = 8;
  let $mtime = message.mtime;
  if ($mtime !== undefined) {
    writeVarint32(bb, 66);
    writeString(bb, $mtime);
  }

  // optional string extra = 9;
  let $extra = message.extra;
  if ($extra !== undefined) {
    writeVarint32(bb, 74);
    writeString(bb, $extra);
  }

  // optional string id_str = 10;
  let $id_str = message.id_str;
  if ($id_str !== undefined) {
    writeVarint32(bb, 82);
    writeString(bb, $id_str);
  }
}

export function decodeCommandDanmaku(binary: Uint8Array): CommandDanmaku {
  return _decodeCommandDanmaku(wrapByteBuffer(binary));
}

function _decodeCommandDanmaku(bb: ByteBuffer): CommandDanmaku {
  let message: CommandDanmaku = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int64 id = 1;
      case 1: {
        message.id = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 oid = 2;
      case 2: {
        message.oid = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 mid = 3;
      case 3: {
        message.mid = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional string command = 4;
      case 4: {
        message.command = readString(bb, readVarint32(bb));
        break;
      }

      // optional string content = 5;
      case 5: {
        message.content = readString(bb, readVarint32(bb));
        break;
      }

      // optional int32 progress = 6;
      case 6: {
        message.progress = readVarint32(bb);
        break;
      }

      // optional string ctime = 7;
      case 7: {
        message.ctime = readString(bb, readVarint32(bb));
        break;
      }

      // optional string mtime = 8;
      case 8: {
        message.mtime = readString(bb, readVarint32(bb));
        break;
      }

      // optional string extra = 9;
      case 9: {
        message.extra = readString(bb, readVarint32(bb));
        break;
      }

      // optional string id_str = 10;
      case 10: {
        message.id_str = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Root {
  state?: number;
  text?: string;
  text_side?: string;
  dm_seg?: SegmentConfig;
  flag?: FlagConfig;
  special_dms?: string[];
  check_box?: boolean;
  count?: Long;
  command_dms?: CommandDanmaku[];
  dm_settings?: WebPlayerConfig;
}

export function encodeRoot(message: Root): Uint8Array {
  let bb = popByteBuffer();
  _encodeRoot(message, bb);
  return toUint8Array(bb);
}

function _encodeRoot(message: Root, bb: ByteBuffer): void {
  // optional int32 state = 1;
  let $state = message.state;
  if ($state !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($state));
  }

  // optional string text = 2;
  let $text = message.text;
  if ($text !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $text);
  }

  // optional string text_side = 3;
  let $text_side = message.text_side;
  if ($text_side !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $text_side);
  }

  // optional SegmentConfig dm_seg = 4;
  let $dm_seg = message.dm_seg;
  if ($dm_seg !== undefined) {
    writeVarint32(bb, 34);
    let nested = popByteBuffer();
    _encodeSegmentConfig($dm_seg, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional FlagConfig flag = 5;
  let $flag = message.flag;
  if ($flag !== undefined) {
    writeVarint32(bb, 42);
    let nested = popByteBuffer();
    _encodeFlagConfig($flag, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated string special_dms = 6;
  let array$special_dms = message.special_dms;
  if (array$special_dms !== undefined) {
    for (let value of array$special_dms) {
      writeVarint32(bb, 50);
      writeString(bb, value);
    }
  }

  // optional bool check_box = 7;
  let $check_box = message.check_box;
  if ($check_box !== undefined) {
    writeVarint32(bb, 56);
    writeByte(bb, $check_box ? 1 : 0);
  }

  // optional int64 count = 8;
  let $count = message.count;
  if ($count !== undefined) {
    writeVarint32(bb, 64);
    writeVarint64(bb, $count);
  }

  // repeated CommandDanmaku command_dms = 9;
  let array$command_dms = message.command_dms;
  if (array$command_dms !== undefined) {
    for (let value of array$command_dms) {
      writeVarint32(bb, 74);
      let nested = popByteBuffer();
      _encodeCommandDanmaku(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional WebPlayerConfig dm_settings = 10;
  let $dm_settings = message.dm_settings;
  if ($dm_settings !== undefined) {
    writeVarint32(bb, 82);
    let nested = popByteBuffer();
    _encodeWebPlayerConfig($dm_settings, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeRoot(binary: Uint8Array): Root {
  return _decodeRoot(wrapByteBuffer(binary));
}

function _decodeRoot(bb: ByteBuffer): Root {
  let message: Root = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 state = 1;
      case 1: {
        message.state = readVarint32(bb);
        break;
      }

      // optional string text = 2;
      case 2: {
        message.text = readString(bb, readVarint32(bb));
        break;
      }

      // optional string text_side = 3;
      case 3: {
        message.text_side = readString(bb, readVarint32(bb));
        break;
      }

      // optional SegmentConfig dm_seg = 4;
      case 4: {
        let limit = pushTemporaryLength(bb);
        message.dm_seg = _decodeSegmentConfig(bb);
        bb.limit = limit;
        break;
      }

      // optional FlagConfig flag = 5;
      case 5: {
        let limit = pushTemporaryLength(bb);
        message.flag = _decodeFlagConfig(bb);
        bb.limit = limit;
        break;
      }

      // repeated string special_dms = 6;
      case 6: {
        let values = message.special_dms || (message.special_dms = []);
        values.push(readString(bb, readVarint32(bb)));
        break;
      }

      // optional bool check_box = 7;
      case 7: {
        message.check_box = !!readByte(bb);
        break;
      }

      // optional int64 count = 8;
      case 8: {
        message.count = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // repeated CommandDanmaku command_dms = 9;
      case 9: {
        let limit = pushTemporaryLength(bb);
        let values = message.command_dms || (message.command_dms = []);
        values.push(_decodeCommandDanmaku(bb));
        bb.limit = limit;
        break;
      }

      // optional WebPlayerConfig dm_settings = 10;
      case 10: {
        let limit = pushTemporaryLength(bb);
        message.dm_settings = _decodeWebPlayerConfig(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
