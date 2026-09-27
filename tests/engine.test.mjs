import test from 'node:test';import assert from 'node:assert/strict';import {signals,infer,prioritize,createState,surface,decide} from '../engine.js';
test('intent derives from text features not ticket id',()=>{assert.equal(infer({...signals[0],id:'X'}).intent,'billing')});
test('outage with broad impact rises first',()=>assert.equal(prioritize(signals)[0].id,'S-15'));
test('system surfaces a proposal without user prompting',()=>{const s=surface(createState());assert.equal(s.pending.createdAutomatically,true)});
test('ambiguity requests human clarification',()=>assert.equal(infer({text:'failed money',hours:1,impact:1}).uncertain,true));
test('override records correction and local action',()=>{let s=surface(createState());s=decide(s,{approve:true,override:'billing'});assert.equal(s.feedback.length,1);assert.equal(s.reviewed[0].chosenIntent,'billing')});
test('reject does not create a task',()=>{let s=surface(createState());s=decide(s,{approve:false});assert.equal(s.reviewed[0].result,'Rejected; no action created')});
test('next proposal appears after review',()=>{let s=surface(createState());const first=s.pending.item.id;s=decide(s,{approve:true});assert.notEqual(s.pending.item.id,first)});
test('uncertain proposal creates clarification rather than guessed action',()=>{let s=surface(createState());s=decide(s,{approve:true});s=decide(s,{approve:true});s=decide(s,{approve:true});assert.equal(s.reviewed[2].result,'Local clarification request')});
