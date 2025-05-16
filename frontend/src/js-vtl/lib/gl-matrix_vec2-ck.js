  1 /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.
  2
  3 Redistribution and use in source and binary forms, with or without modification,
  4 are permitted provided that the following conditions are met:
  5
  6   * Redistributions of source code must retain the above copyright notice, this
  7     list of conditions and the following disclaimer.
  8   * Redistributions in binary form must reproduce the above copyright notice,
  9     this list of conditions and the following disclaimer in the documentation
 10     and/or other materials provided with the distribution.
 11
 12 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 13 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 14 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 15 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 16 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 17 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 18 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 19 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 20 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 21 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

  if(!GLMAT_EPSILON) {
      var GLMAT_EPSILON = 0.000001;
  }

  if(!GLMAT_ARRAY_TYPE) {
      var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
  }

  if(!GLMAT_RANDOM) {
      var GLMAT_RANDOM = Math.random;
  }

  /**
   * @class Common utilities
   * @name glMatrix
   */
  var glMatrix = {};

  /**
   * Sets the type of array used when creating new vectors and matricies
   *
   * @param {Type} type Array type, such as Float32Array or Array
   */
  glMatrix.setMatrixArrayType = function(type) {
      GLMAT_ARRAY_TYPE = type;
  }

  if(typeof(exports) !== 'undefined') {
      exports.glMatrix = glMatrix;
  }




  1 /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.
  2
  3 Redistribution and use in source and binary forms, with or without modification,
  4 are permitted provided that the following conditions are met:
  5
  6   * Redistributions of source code must retain the above copyright notice, this
  7     list of conditions and the following disclaimer.
  8   * Redistributions in binary form must reproduce the above copyright notice,
  9     this list of conditions and the following disclaimer in the documentation
 10     and/or other materials provided with the distribution.
 11
 12 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 13 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 14 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 15 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 16 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 17 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 18 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 19 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 20 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 21 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
 22
 23 /**
 24  * @class 2 Dimensional Vector
 25  * @name vec2
 26  */
 27 var vec2 = {};
 28
 29 /**
 30  * Creates a new, empty vec2
 31  *
 32  * @returns {vec2} a new 2D vector
 33  */
 34 vec2.create = function() {
 35     var out = new GLMAT_ARRAY_TYPE(2);
 36     out[0] = 0;
 37     out[1] = 0;
 38     return out;
 39 };
 40
 41 /**
 42  * Creates a new vec2 initialized with values from an existing vector
 43  *
 44  * @param {vec2} a vector to clone
 45  * @returns {vec2} a new 2D vector
 46  */
 47 vec2.clone = function(a) {
 48     var out = new GLMAT_ARRAY_TYPE(2);
 49     out[0] = a[0];
 50     out[1] = a[1];
 51     return out;
 52 };
 53
 54 /**
 55  * Creates a new vec2 initialized with the given values
 56  *
 57  * @param {Number} x X component
 58  * @param {Number} y Y component
 59  * @returns {vec2} a new 2D vector
 60  */
 61 vec2.fromValues = function(x, y) {
 62     var out = new GLMAT_ARRAY_TYPE(2);
 63     out[0] = x;
 64     out[1] = y;
 65     return out;
 66 };
 67
 68 /**
 69  * Copy the values from one vec2 to another
 70  *
 71  * @param {vec2} out the receiving vector
 72  * @param {vec2} a the source vector
 73  * @returns {vec2} out
 74  */
 75 vec2.copy = function(out, a) {
 76     out[0] = a[0];
 77     out[1] = a[1];
 78     return out;
 79 };
 80
 81 /**
 82  * Set the components of a vec2 to the given values
 83  *
 84  * @param {vec2} out the receiving vector
 85  * @param {Number} x X component
 86  * @param {Number} y Y component
 87  * @returns {vec2} out
 88  */
 89 vec2.set = function(out, x, y) {
 90     out[0] = x;
 91     out[1] = y;
 92     return out;
 93 };
 94
 95 /**
 96  * Adds two vec2's
 97  *
 98  * @param {vec2} out the receiving vector
 99  * @param {vec2} a the first operand
100  * @param {vec2} b the second operand
101  * @returns {vec2} out
102  */
103 vec2.add = function(out, a, b) {
104     out[0] = a[0] + b[0];
105     out[1] = a[1] + b[1];
106     return out;
107 };
108
109 /**
110  * Subtracts vector b from vector a
111  *
112  * @param {vec2} out the receiving vector
113  * @param {vec2} a the first operand
114  * @param {vec2} b the second operand
115  * @returns {vec2} out
116  */
117 vec2.subtract = function(out, a, b) {
118     out[0] = a[0] - b[0];
119     out[1] = a[1] - b[1];
120     return out;
121 };
122
123 /**
124  * Alias for {@link vec2.subtract}
125  * @function
126  */
127 vec2.sub = vec2.subtract;
128
129 /**
130  * Multiplies two vec2's
131  *
132  * @param {vec2} out the receiving vector
133  * @param {vec2} a the first operand
134  * @param {vec2} b the second operand
135  * @returns {vec2} out
136  */
137 vec2.multiply = function(out, a, b) {
138     out[0] = a[0] * b[0];
139     out[1] = a[1] * b[1];
140     return out;
141 };
142
143 /**
144  * Alias for {@link vec2.multiply}
145  * @function
146  */
147 vec2.mul = vec2.multiply;
148
149 /**
150  * Divides two vec2's
151  *
152  * @param {vec2} out the receiving vector
153  * @param {vec2} a the first operand
154  * @param {vec2} b the second operand
155  * @returns {vec2} out
156  */
157 vec2.divide = function(out, a, b) {
158     out[0] = a[0] / b[0];
159     out[1] = a[1] / b[1];
160     return out;
161 };
162
163 /**
164  * Alias for {@link vec2.divide}
165  * @function
166  */
167 vec2.div = vec2.divide;
168
169 /**
170  * Returns the minimum of two vec2's
171  *
172  * @param {vec2} out the receiving vector
173  * @param {vec2} a the first operand
174  * @param {vec2} b the second operand
175  * @returns {vec2} out
176  */
177 vec2.min = function(out, a, b) {
178     out[0] = Math.min(a[0], b[0]);
179     out[1] = Math.min(a[1], b[1]);
180     return out;
181 };
182
183 /**
184  * Returns the maximum of two vec2's
185  *
186  * @param {vec2} out the receiving vector
187  * @param {vec2} a the first operand
188  * @param {vec2} b the second operand
189  * @returns {vec2} out
190  */
191 vec2.max = function(out, a, b) {
192     out[0] = Math.max(a[0], b[0]);
193     out[1] = Math.max(a[1], b[1]);
194     return out;
195 };
196
197 /**
198  * Scales a vec2 by a scalar number
199  *
200  * @param {vec2} out the receiving vector
201  * @param {vec2} a the vector to scale
202  * @param {Number} b amount to scale the vector by
203  * @returns {vec2} out
204  */
205 vec2.scale = function(out, a, b) {
206     out[0] = a[0] * b;
207     out[1] = a[1] * b;
208     return out;
209 };
210
211 /**
212  * Adds two vec2's after scaling the second operand by a scalar value
213  *
214  * @param {vec2} out the receiving vector
215  * @param {vec2} a the first operand
216  * @param {vec2} b the second operand
217  * @param {Number} scale the amount to scale b by before adding
218  * @returns {vec2} out
219  */
220 vec2.scaleAndAdd = function(out, a, b, scale) {
221     out[0] = a[0] + (b[0] * scale);
222     out[1] = a[1] + (b[1] * scale);
223     return out;
224 };
225
226 /**
227  * Calculates the euclidian distance between two vec2's
228  *
229  * @param {vec2} a the first operand
230  * @param {vec2} b the second operand
231  * @returns {Number} distance between a and b
232  */
233 vec2.distance = function(a, b) {
234     var x = b[0] - a[0],
235         y = b[1] - a[1];
236     return Math.sqrt(x*x + y*y);
237 };
238
239 /**
240  * Alias for {@link vec2.distance}
241  * @function
242  */
243 vec2.dist = vec2.distance;
244
245 /**
246  * Calculates the squared euclidian distance between two vec2's
247  *
248  * @param {vec2} a the first operand
249  * @param {vec2} b the second operand
250  * @returns {Number} squared distance between a and b
251  */
252 vec2.squaredDistance = function(a, b) {
253     var x = b[0] - a[0],
254         y = b[1] - a[1];
255     return x*x + y*y;
256 };
257
258 /**
259  * Alias for {@link vec2.squaredDistance}
260  * @function
261  */
262 vec2.sqrDist = vec2.squaredDistance;
263
264 /**
265  * Calculates the length of a vec2
266  *
267  * @param {vec2} a vector to calculate length of
268  * @returns {Number} length of a
269  */
270 vec2.length = function (a) {
271     var x = a[0],
272         y = a[1];
273     return Math.sqrt(x*x + y*y);
274 };
275
276 /**
277  * Alias for {@link vec2.length}
278  * @function
279  */
280 vec2.len = vec2.length;
281
282 /**
283  * Calculates the squared length of a vec2
284  *
285  * @param {vec2} a vector to calculate squared length of
286  * @returns {Number} squared length of a
287  */
288 vec2.squaredLength = function (a) {
289     var x = a[0],
290         y = a[1];
291     return x*x + y*y;
292 };
293
294 /**
295  * Alias for {@link vec2.squaredLength}
296  * @function
297  */
298 vec2.sqrLen = vec2.squaredLength;
299
300 /**
301  * Negates the components of a vec2
302  *
303  * @param {vec2} out the receiving vector
304  * @param {vec2} a vector to negate
305  * @returns {vec2} out
306  */
307 vec2.negate = function(out, a) {
308     out[0] = -a[0];
309     out[1] = -a[1];
310     return out;
311 };
312
313 /**
314  * Normalize a vec2
315  *
316  * @param {vec2} out the receiving vector
317  * @param {vec2} a vector to normalize
318  * @returns {vec2} out
319  */
320 vec2.normalize = function(out, a) {
321     var x = a[0],
322         y = a[1];
323     var len = x*x + y*y;
324     if (len > 0) {
325         //TODO: evaluate use of glm_invsqrt here?
326         len = 1 / Math.sqrt(len);
327         out[0] = a[0] * len;
328         out[1] = a[1] * len;
329     }
330     return out;
331 };
332
333 /**
334  * Calculates the dot product of two vec2's
335  *
336  * @param {vec2} a the first operand
337  * @param {vec2} b the second operand
338  * @returns {Number} dot product of a and b
339  */
340 vec2.dot = function (a, b) {
341     return a[0] * b[0] + a[1] * b[1];
342 };
343
344 /**
345  * Computes the cross product of two vec2's
346  * Note that the cross product must by definition produce a 3D vector
347  *
348  * @param {vec3} out the receiving vector
349  * @param {vec2} a the first operand
350  * @param {vec2} b the second operand
351  * @returns {vec3} out
352  */
353 vec2.cross = function(out, a, b) {
354     var z = a[0] * b[1] - a[1] * b[0];
355     out[0] = out[1] = 0;
356     out[2] = z;
357     return out;
358 };
359
360 /**
361  * Performs a linear interpolation between two vec2's
362  *
363  * @param {vec2} out the receiving vector
364  * @param {vec2} a the first operand
365  * @param {vec2} b the second operand
366  * @param {Number} t interpolation amount between the two inputs
367  * @returns {vec2} out
368  */
369 vec2.lerp = function (out, a, b, t) {
370     var ax = a[0],
371         ay = a[1];
372     out[0] = ax + t * (b[0] - ax);
373     out[1] = ay + t * (b[1] - ay);
374     return out;
375 };
376
377 /**
378  * Generates a random vector with the given scale
379  *
380  * @param {vec2} out the receiving vector
381  * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
382  * @returns {vec2} out
383  */
384 vec2.random = function (out, scale) {
385     scale = scale || 1.0;
386     var r = GLMAT_RANDOM() * 2.0 * Math.PI;
387     out[0] = Math.cos(r) * scale;
388     out[1] = Math.sin(r) * scale;
389     return out;
390 };
391
392 /**
393  * Transforms the vec2 with a mat2
394  *
395  * @param {vec2} out the receiving vector
396  * @param {vec2} a the vector to transform
397  * @param {mat2} m matrix to transform with
398  * @returns {vec2} out
399  */
400 vec2.transformMat2 = function(out, a, m) {
401     var x = a[0],
402         y = a[1];
403     out[0] = m[0] * x + m[2] * y;
404     out[1] = m[1] * x + m[3] * y;
405     return out;
406 };
407
408 /**
409  * Transforms the vec2 with a mat2d
410  *
411  * @param {vec2} out the receiving vector
412  * @param {vec2} a the vector to transform
413  * @param {mat2d} m matrix to transform with
414  * @returns {vec2} out
415  */
416 vec2.transformMat2d = function(out, a, m) {
417     var x = a[0],
418         y = a[1];
419     out[0] = m[0] * x + m[2] * y + m[4];
420     out[1] = m[1] * x + m[3] * y + m[5];
421     return out;
422 };
423
424 /**
425  * Transforms the vec2 with a mat3
426  * 3rd vector component is implicitly '1'
427  *
428  * @param {vec2} out the receiving vector
429  * @param {vec2} a the vector to transform
430  * @param {mat3} m matrix to transform with
431  * @returns {vec2} out
432  */
433 vec2.transformMat3 = function(out, a, m) {
434     var x = a[0],
435         y = a[1];
436     out[0] = m[0] * x + m[3] * y + m[6];
437     out[1] = m[1] * x + m[4] * y + m[7];
438     return out;
439 };
440
441 /**
442  * Transforms the vec2 with a mat4
443  * 3rd vector component is implicitly '0'
444  * 4th vector component is implicitly '1'
445  *
446  * @param {vec2} out the receiving vector
447  * @param {vec2} a the vector to transform
448  * @param {mat4} m matrix to transform with
449  * @returns {vec2} out
450  */
451 vec2.transformMat4 = function(out, a, m) {
452     var x = a[0],
453         y = a[1];
454     out[0] = m[0] * x + m[4] * y + m[12];
455     out[1] = m[1] * x + m[5] * y + m[13];
456     return out;
457 };
458
459 /**
460  * Perform some operation over an array of vec2s.
461  *
462  * @param {Array} a the array of vectors to iterate over
463  * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
464  * @param {Number} offset Number of elements to skip at the beginning of the array
465  * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
466  * @param {Function} fn Function to call for each vector in the array
467  * @param {Object} [arg] additional argument to pass to fn
468  * @returns {Array} a
469  * @function
470  */
471 vec2.forEach = (function() {
472     var vec = vec2.create();
473
474     return function(a, stride, offset, count, fn, arg) {
475         var i, l;
476         if(!stride) {
477             stride = 2;
478         }
479
480         if(!offset) {
481             offset = 0;
482         }
483
484         if(count) {
485             l = Math.min((count * stride) + offset, a.length);
486         } else {
487             l = a.length;
488         }
489
490         for(i = offset; i < l; i += stride) {
491             vec[0] = a[i]; vec[1] = a[i+1];
492             fn(vec, vec, arg);
493             a[i] = vec[0]; a[i+1] = vec[1];
494         }
495
496         return a;
497     };
498 })();
499
500 /**
501  * Returns a string representation of a vector
502  *
503  * @param {vec2} vec vector to represent as a string
504  * @returns {String} string representation of the vector
505  */
506 vec2.str = function (a) {
507     return 'vec2(' + a[0] + ', ' + a[1] + ')';
508 };
509
510 if(typeof(exports) !== 'undefined') {
511     exports.vec2 = vec2;
512 }
513