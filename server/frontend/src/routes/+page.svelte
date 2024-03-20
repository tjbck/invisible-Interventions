<script>
	import { ENDPOINT } from '$lib/constants';
	import toast from 'svelte-french-toast';
	import dayjs from 'dayjs';

	const interventions = [
		'gradual-grayscale',
		'time-limit',
		'tap-to-scroll',
		'vibration-scroll',
		'shake-to-continue'
	];
	let selectedIntervention = '';
	let submitted = false;

	let checkboxElement = null;
	let reviewed = null;

	$: if (reviewed == false) {
		window.location.reload();
	}

	let formData = {
		date: dayjs().format('YYYY-MM-DD'),
		name: '',
		email: '',
		externalId: ''
	};

	const downloadExtension = (name = 'force-login') => {
		window.open(
			`https://github.com/tjbck/invisible-interventions/raw/main/extensions/_crx/${name}.crx`,
			'_self'
		);

		toast.success(
			'Add the extension by tapping on the three vertical dots in the top-right corner to open the menu and selecting "Extensions".',
			{
				duration: 10000
			}
		);
	};

	const getRandomInt = (max) => {
		return Math.floor(Math.random() * max);
	};

	const submitForm = async () => {
		console.log(checkboxElement);
		if (checkboxElement.checked) {
			if (formData.email !== '' && formData.name !== '') {
				const res = await fetch(`${ENDPOINT}/tracking/users/signup`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						date: formData.date,
						email: formData.email,
						name: formData.name,
						external_id: formData.externalId
					})
				})
					.then(async (res) => {
						if (!res.ok) throw await res.json();
						return await res.json();
					})
					.catch((err) => {
						console.log(err);
						toast.error(err.detail);
						return null;
					});

				if (res && res.id !== undefined) {
					// 0,1,2,3,4
					submitted = true;
					selectedIntervention = interventions[res.id % 5];
				}

				console.log(formData);
			} else {
				toast.error('Please complete all required form inputs.');
			}
		} else {
			toast.error('Please consent to the consent form.');
		}
	};
</script>

<svelte:head>
	<title>Invisible Interventions | SFU</title>
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div class="mx-4 mb-20">
	<div class="">
		<div class="flex justify-center">
			<img src="/sfu.png" alt="sfu logo" />
		</div>
		<div class="text-xl text-gray-600 font-semibold">Participate in a Study!</div>

		<div>
			<div class="mb-5 text-sm text-gray-600 break-words">
				Comparing Invisible Interventions with Empowering Interventions: How Can Reduced Visibility
				or Enhanced Agency allow Users to Take Control of their Social Media Usage?
			</div>

			<div class="text-sm">
				<div>
					To qualify for compensation, please note the following requirements:

					<ol class=" list-decimal pl-5 font-semibold">
						<li>You MUST use the app every day during the study period.</li>

						<li>
							The total duration of usage over the 8-day period should exceed a minimum of 1 hour.
						</li>
					</ol>

					We will be closely monitoring your usage, and failure to use the app every day will result
					in automatic disqualification. Ensure you use the app for at least 1 hour throughout the
					study to remain eligible for compensation.
				</div>
			</div>
		</div>
	</div>

	<hr class="my-6" />

	{#if submitted}
		<div class=" my-6">
			<div class="text-center text-gray-700 text-2xl font-semibold">
				<div class="mb-5 text-sm text-gray-600 break-words bg-blue-50 rounded-lg p-4 text-left">
					<div class=" font-semibold text-lg">INFO: Prolific Users</div>

					<div class=" font-normal">
						Please put NOCODE for completion code for now, and we'll send out the payment manually
						after the study.
					</div>
				</div>

				Thanks for signing up!<br />

				<div class="">
					You've been assigned to the '{selectedIntervention}' intervention. 🎉
				</div>

				<br />
				<div
					class="mb-3 text-sm text-center font-semibold w-full rounded-full py-4 px-5 text-green-800 bg-green-100 hover:bg-green-300 border transition-all cursor-pointer"
					on:click={() => {
						downloadExtension(selectedIntervention);
					}}
				>
					Click here to download {selectedIntervention} intervention
				</div>
			</div>
		</div>
	{:else}
		<form on:submit={submitForm}>
			<div class=" my-6">
				<label for="date" class="block mb-2 text-sm text-gray-900">Date</label>
				<input
					disabled
					type="date"
					id="date"
					bind:value={formData.date}
					class="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 disabled:bg-gray-200 block w-full p-3"
					required
				/>
			</div>

			<div class=" my-6">
				<label for="name" class="block mb-2 text-sm text-gray-900">Participant Name</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					class="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 disabled:bg-gray-200 block w-full p-3"
					placeholder="Your full name"
					required
					autocomplete="name"
				/>
				<div class="mt-2 text-xs text-gray-500 text-right">
					<span>REQUIRED</span>
				</div>
			</div>

			<div class=" my-6">
				<label for="email" class="block mb-2 text-sm text-gray-900">Participant Email</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					class="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 disabled:bg-gray-200 block w-full p-3"
					placeholder="Your email address"
					required
					autocomplete="email"
				/>
				<div class="mt-2 text-xs text-gray-500 text-right">
					<span>REQUIRED</span>
				</div>
			</div>

			<div class=" my-6">
				<label for="name" class="block mb-2 text-sm text-gray-900"
					>Participant ID (Prolific ID)</label
				>
				<input
					type="text"
					bind:value={formData.externalId}
					class="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 disabled:bg-gray-200 block w-full p-3"
					placeholder="Your participant ID"
					required
				/>
				<div class="mt-2 text-xs text-gray-500 text-right">
					<span>REQUIRED</span>
				</div>
			</div>

			<div class=" my-6">
				<label for="email" class="block mb-2 text-sm text-gray-900">Consent Form</label>

				<div class=" text-sm text-purple-900 underline">
					<a
						href="https://drive.google.com/file/d/1qUy-EIVPdW0N2Rzimv_E2piF3h1vOAFM/view?usp=sharing"
						target="_blank">Consent Form Link</a
					>
				</div>
				<div class="flex text-sm text-gray-600">
					<input
						type="checkbox"
						bind:this={checkboxElement}
						class="w-4 h-4 mt-1.5 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						required
					/>
					<div class=" mt-1">
						I have thoroughly read and understood the content of the consent form for the research
						study. I hereby acknowledge and agree with all the terms and conditions outlined in the
						document. I willingly consent to participate in the research and understand my rights
						and responsibilities as a participant.
					</div>
				</div>
				<div class="mt-2 text-xs text-gray-500 text-right">
					<span>REQUIRED</span>
				</div>
			</div>

			<div class="mb-5 text-sm text-gray-600 break-words bg-red-100 rounded-lg p-4">
				<div class=" font-semibold text-lg">Before you continue!</div>

				<div>
					Please ensure you've reviewed the instructions for the next step below, and sign up and
					submit the form only if you're fully committed to participating in the study; if unsure,
					please refrain from submitting. <span class=" font-semibold"
						>If you sign up and later abandon or fail to complete the entire study, your actions
						will be reported to Prolific for misuse of the platform. This could result in serious
						consequences for your Prolific account. So, please ensure your commitment before
						proceeding.</span
					>
				</div>
			</div>

			<div class=" my-6">
				<div class="flex text-sm text-gray-600">
					<input
						type="radio"
						value={false}
						bind:group={reviewed}
						class="w-4 h-4 mt-1.5 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						required
					/>
					<div class=" mt-1">
						I have not reviewed the instruction materials below, and I don't want to participate in
						the study.
					</div>
				</div>

				<div class="flex text-sm text-gray-600">
					<input
						type="radio"
						value={true}
						bind:group={reviewed}
						class="w-4 h-4 mt-1.5 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						required
					/>
					<div class=" mt-1">
						I have thoroughly reviewed the instruction materials below, and I agree to fully
						participate in the study.
					</div>
				</div>

				<div class="mt-2 text-xs text-gray-500 text-right">
					<span>REQUIRED</span>
				</div>
			</div>

			{#if reviewed}
				<div class="flex justify-end my-6">
					<div>
						<button
							class="flex text-sm w-full font-normal rounded-lg py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white transition-all cursor-pointer"
							type="submit"
						>
							<div class="">Submit</div>

							<div class="my-auto ml-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-4 h-4"
								>
									<path
										d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"
									/>
								</svg>
							</div>
						</button>
					</div>
				</div>
			{/if}
		</form>
	{/if}

	<hr class="my-6" />

	<div>
		<div class="text-xl text-gray-600 font-semibold">Intervention Set-up Instructions</div>

		<div class="mt-2 text-sm text-gray-600 break-words">
			<a
				class=" underline"
				href="https://drive.google.com/file/d/1eb6Xb25-2LV54AeiHnM37xRnm-cEAMWy/view?usp=drive_link"
				target="_blank">Click here for a video tutorial outlining the steps below</a
			>
		</div>

		<div class="mt-2 text-sm text-gray-700 break-words">
			<li>Delete the Tik Tok app from your phone.</li>

			<li>
				<a
					href="https://play.google.com/store/apps/details?id=com.kiwibrowser.browser"
					class=" underline">Download and install the Kiwi Browser from the Google Play Store.</a
				>
			</li>
			<li>
				On your phone, download the crx file which includes all of the extension contents from this
				website by submitting your email address above.
			</li>

			<li>Open the Kiwi Browser on your Android phone.</li>
			<li>
				Tap on the three vertical dots in the top-right corner to open the menu. Select "Extensions"
				from the menu. In the Extensions menu, enable "Developer mode" by toggling the switch.
			</li>

			<li>
				Tap on "+ (from .zip/.crx/.user.js)" and navigate to the folder where you downloaded the
				extension. Select the crx extension file and tap "OK" to install it.
			</li>

			<li>The extension should now be installed and visible in the Extensions menu.</li>

			<li>
				Open up the <a href="https://tiktok.com/" class=" underline">Tik Tok website</a> , and a pre-study
				survey will be automatically opened. Complete this survey, and you will have officially begun
				the study!
			</li>

			<li>
				At this point, feel free to use the Kiwi browser with Tik Tok open as if it is the Tik Tok
				application itself. While you use Tik Tok, we will be gathering usage data for us to analyze
				after the study has been completed.
			</li>

			<li>
				To qualify for compensation, please note the following requirements:

				<ol class=" list-decimal pl-5 font-semibold">
					<li>You MUST use the app every day during the study period.</li>

					<li>
						The total duration of usage over the 8-day period should exceed a minimum of 1 hour.
					</li>
				</ol>

				We will be closely monitoring your usage, and failure to use the app every day will result
				in automatic disqualification. Ensure you use the app for at least 1 hour throughout the
				study to remain eligible for compensation.
			</li>
		</div>
	</div>
</div>
