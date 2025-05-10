---
title: "Seeing Through the TV"
date: 2025-05-05
tags: [curious, TV, journey, tech]
description: "This is a journey through one retina, staring with a TV screen and diving deep into the tech beneath."
---

I was very bored at home. Back then, TV was everything to me. I used to watch it for hours as a kid, and there was always this strange thought that stuck with me, how did people get inside that little box? How did they become so small? Where did they go when I turned it off? I genuinely worried for them. It felt like people were trapped just for our entertainment. Silly thoughts, maybe, but honest ones. Eventually, I understood that it wasn’t people but it was just a screen showing light. But recently, after not watching TV for a long time, I saw a movie on it, and this time, I didn’t just watch, I *looked through* the TV.

The screen was showing moving images, but when I began to see deeper. What looked like one image was actually made of millions of tiny rectangles called pixels. Each pixel held three smaller subpixels like red, green, and blue and by adjusting their brightness, they created many color. Full brightness made white, and total darkness made black. But those pixels weren’t glowing on their own. Behind them was a field of LEDs, shining light forward, and the pixels acted like windows, opening and closing based on electric signals, shaping what light came through.

These signals weren’t random, they were precise, changing values around 120 times every second to create smooth motion which we call frames per second. But then, I wondered, *where this data comes from ?*

Buried inside the TV was a display driver IC, which carefully turns on and off pixel by rows and columns on sync. But it also didn’t make this data, it just delivered it. Before that, the image existed in memory — a section of RAM called the framebuffer. There, every frame waited before being drawn to the screen. And the one who filled this buffer? The system’s real brain, the System on Chip (SoC).

This SoC did everything. It received a compressed video stream from the HDMI input, like a digital data wrapped in layers. It unpacked this video using codecs like HEVC, decoded it into individual frames, and wrote them into the framebuffer, preparing them for display. At same time, it processed audio, handled remote inputs, ran some of its own UI, connected to the internet when needed but i concentrated were this video data came from so i followed it it ignoring all this functions. But this video data, *where did that come from?*

I turned my eyes to the HDMI cable. This cable wasn’t just a wire with single or double or triple conducting material enclosed by a plastic material, but it was a pipeline of organized, encrypted data. Packets of audio, video, and control commands moved across it, following protocols and clock signals with sync. The other end of the cable led to the set-top box.

Now this box was fascinating. It stood as the middleware between the broadcast world and the TV. But it didn’t just pass data, it transformed it. It received a stream from the antenna which wasn't this clean as a readable video. It was compressed to save space, encrypted to protect rights, and modulated into radio frequencies. The antenna caught this invisible signal from the sky, aimed at a satellite. These were pure electromagnetic waves, modulated to carry bits. The set-top box tuned into the right frequency, demodulated it, decrypted it, decompressed it, and only then reconstructed the original stream of images and sounds.

And I forget that in my hand there was a remote control, just a piece of plastic, but every button press sent a pattern of infrared light to the set-top box. It decoded this invisible flicker, interpreted it as a command, maybe to change the channel or change a volume level. It routed that command to its internal OS and software. Then the content switched, new video started to flow and back into the HDMI cable it went, through the SoC, into the framebuffer, down to the display driver IC, through the subpixels, and finally, into my eyes.

Everything I saw on that screen every motion, every frame, every color started in the air, as a modulated signal from a distant satellite. That signal flew through space, was caught by a dish or antenna, passed into circuits, decrypted, decoded, rendered, so a single pixel could flicker from red to green to blue.

And none of it would’ve worked without the power. So i was searching who was mitochondria (Power house) of this all these things, then deep inside the TV, setup-box was the SMPS — the Switch Mode Power Supply which wass rectifying AC input to pulsating DC, chop it to series of pulses which are then filtered and regulated as stable DC current which was needed by each part of the system. Some for the LEDs, some for the SoC, some for memory, others for communication lines. It delivered electrons everywhere.

I tried to look further into the SMPS, into the flow of electrons themselves but somewhere between, I fell asleep.

And in that moment, I realized even when I close my eyes, the journey continues. Through the air, through wires, through silicon. Data never stops. It just waits for someone curious enough to look for it.
