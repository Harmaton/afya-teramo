'use client';

import { useState } from 'react';
import { registrationSchema, type RegistrationInput } from '@/lib/types/abbis-hackathon';

const TRACKS = [
  'Donor Management',
  'Collection & Processing',
  'Inventory Management',
  'Distribution & Logistics',
  'Hospital Transfusion Services',
  'Data, Analytics & AI',
] as const;

type Member = { name: string; email: string };

const TABS = ['team', 'lead', 'members', 'eligibility'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  team: 'Team',
  lead: 'Lead',
  members: 'Members',
  eligibility: 'Eligibility',
};

const FIELD_HELP: Record<string, string> = {
  isSolo: 'Toggle on if you\u2019re applying without a team.',
  teamName: 'Team name \u2014 this becomes your row label in the sheet.',
  trackFocus: 'Pick one of the six ABBIS focus areas.',
  leadName: 'Full name of the team lead or solo applicant.',
  leadEmail: 'Confirmation and kickoff details go here.',
  leadPhone: 'Include country code, e.g. +254...',
  country: 'Citizenship or verifiable residency \u2014 must be an African country.',
  members: 'Up to 3 additional teammates. Max team size is 4.',
  ageConfirmed: 'Required \u2014 applicants must be 18\u201335 at time of application.',
  portfolioLink: 'GitHub, LinkedIn, or portfolio URL.',
  workHistory: 'A few lines on relevant experience or past projects.',
};

export default function RegistrationForm() {

  const [activeTab, setActiveTab] = useState<Tab>('team');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSolo, setIsSolo] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [values, setValues] = useState({
    teamName: '',
    trackFocus: '' as RegistrationInput['trackFocus'] | '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    country: '',
    ageConfirmed: false,
    portfolioLink: '',
    workHistory: '',
  });

  function setField<K extends keyof typeof values>(key: K, val: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function addMember() {
    if (members.length < 3) setMembers([...members, { name: '', email: '' }]);
  }
  function updateMember(index: number, key: keyof Member, val: string) {
    const next = [...members];
    next[index] = { ...next[index], [key]: val };
    setMembers(next);
  }
  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index));
  }

  const activeIndex = TABS.indexOf(activeTab);
const isLastTab = activeIndex === TABS.length - 1;

function handleNext() {
  if (isLastTab) {
    handleSubmit();
  } else {
    setActiveTab(TABS[activeIndex + 1]);
  }
}

  async function handleSubmit() {
    setServerError(null);
    setFieldErrors({});

 const payload: RegistrationInput = {
  ...values,
  trackFocus: values.trackFocus as RegistrationInput['trackFocus'],
  ageConfirmed: values.ageConfirmed as RegistrationInput['ageConfirmed'],
  isSolo,
  members: isSolo ? [] : members,
};

console.log(payload)

    const parsed = registrationSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[issue.path.join('.')] = issue.message;
      setFieldErrors(errors);
      // Jump to the first tab containing an error
      const firstPath = parsed.error.issues[0]?.path[0];
      if (firstPath === 'teamName' || firstPath === 'trackFocus') setActiveTab('team');
      else if (firstPath === 'leadName' || firstPath === 'leadEmail' || firstPath === 'leadPhone' || firstPath === 'country') setActiveTab('lead');
      else if (firstPath === 'members') setActiveTab('members');
      else setActiveTab('eligibility');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/hackathon-register', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });

      console.log(res)
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setServerError(body?.error ?? 'Something went wrong, try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setServerError('Network error \u2014 check your connection and try again.');
      setStatus('error');
    }
  }

  const rowCounter = useRowCounter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNext();
      }}
      className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-925 shadow-2xl shadow-black/40"
    >

     {/* Title bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 px-4 py-2.5">
        <div className="flex items-center gap-2">
            <SheetIcon />
            <span className="font-mono text-xs text-white/90">
            ABBIS Hackathon Registrations
            </span>
        </div>
        {status === 'success' && (
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
            <CheckIcon /> Saved
            </span>
        )}
        </div>

      {/* Formula bar */}
      <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-3 py-2">
        <span className="font-mono text-xs text-neutral-600">fx</span>
        <span
          className={`truncate font-mono text-xs ${
            focusedField && fieldErrors[focusedField] ? 'text-red-400' : 'text-neutral-500'
          }`}
        >
          {focusedField && fieldErrors[focusedField]
            ? fieldErrors[focusedField]
            : focusedField
            ? FIELD_HELP[focusedField]
            : 'Select a field to see details.'}
        </span>
      </div>

      {/* Column letters (desktop only) */}
      <div className="hidden grid-cols-[40px_repeat(3,1fr)] border-b border-neutral-800 bg-neutral-900/40 md:grid">
        <div />
        {['A', 'B', 'C'].map((l) => (
          <div key={l} className="border-l border-neutral-800 py-1 text-center font-mono text-[10px] text-neutral-600">
            {l}
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className="divide-y divide-neutral-800">
        <HeaderRow n={rowCounter.next()} label={TAB_LABELS[activeTab].toUpperCase()} />

        {activeTab === 'team' && (
          <>
            <Row n={rowCounter.next()}>
              <Cell span={3}>
                <ToggleField
                  checked={isSolo}
                  onChange={setIsSolo}
                  onFocusField={() => setFocusedField('isSolo')}
                  label="Applying solo"
                />
              </Cell>
            </Row>
            <Row n={rowCounter.next()}>
              <Cell span={3} error={!!fieldErrors.teamName}>
                <input
                  value={values.teamName}
                  onChange={(e) => setField('teamName', e.target.value)}
                  onFocus={() => setFocusedField('teamName')}
                  placeholder={isSolo ? 'Your name (used as team name)' : 'Team name'}
                  className={inputClass}
                />
              </Cell>
            </Row>
            <Row n={rowCounter.next()}>
              <Cell span={3} error={!!fieldErrors.trackFocus}>
                <select
                  value={values.trackFocus}
                  onChange={(e) => setField('trackFocus', e.target.value as RegistrationInput['trackFocus'])}
                  onFocus={() => setFocusedField('trackFocus')}
                  className={inputClass}
                >
                  <option value="" disabled>Select a focus area</option>
                  {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Cell>
            </Row>
          </>
        )}

        {activeTab === 'lead' && (
          <>
            <Row n={rowCounter.next()}>
              <Cell span={3} error={!!fieldErrors.leadName}>
                <input
                  value={values.leadName}
                  onChange={(e) => setField('leadName', e.target.value)}
                  onFocus={() => setFocusedField('leadName')}
                  placeholder="Full name"
                  className={inputClass}
                />
              </Cell>
            </Row>
            <Row n={rowCounter.next()}>
              <Cell span={1.5} error={!!fieldErrors.leadEmail}>
                <input
                  type="email"
                  value={values.leadEmail}
                  onChange={(e) => setField('leadEmail', e.target.value)}
                  onFocus={() => setFocusedField('leadEmail')}
                  placeholder="Email"
                  className={inputClass}
                />
              </Cell>
              <Cell span={1.5} error={!!fieldErrors.leadPhone}>
                <input
                  type="tel"
                  value={values.leadPhone}
                  onChange={(e) => setField('leadPhone', e.target.value)}
                  onFocus={() => setFocusedField('leadPhone')}
                  placeholder="Phone"
                  className={inputClass}
                />
              </Cell>
            </Row>
            <Row n={rowCounter.next()}>
              <Cell span={3} error={!!fieldErrors.country}>
                <input
                  value={values.country}
                  onChange={(e) => setField('country', e.target.value)}
                  onFocus={() => setFocusedField('country')}
                  placeholder="Country of citizenship / residency"
                  className={inputClass}
                />
              </Cell>
            </Row>
          </>
        )}

        {activeTab === 'members' && (
          <>
            {isSolo && (
              <Row n={rowCounter.next()}>
                <Cell span={3}>
                  <p className="px-3 py-2 font-mono text-xs text-neutral-600">
                    Not applicable \u2014 solo applicant
                  </p>
                </Cell>
              </Row>
            )}
            {!isSolo && members.map((m, i) => (
              <Row n={rowCounter.next()} key={i}>
                <Cell span={1}>
                  <input
                    value={m.name}
                    onChange={(e) => updateMember(i, 'name', e.target.value)}
                    onFocus={() => setFocusedField('members')}
                    placeholder="Name"
                    className={inputClass}
                  />
                </Cell>
                <Cell span={1}>
                  <input
                    type="email"
                    value={m.email}
                    onChange={(e) => updateMember(i, 'email', e.target.value)}
                    onFocus={() => setFocusedField('members')}
                    placeholder="Email"
                    className={inputClass}
                  />
                </Cell>
                <Cell span={1}>
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="flex h-full w-full items-center justify-center font-mono text-xs text-neutral-600 hover:text-red-400"
                  >
                    Remove
                  </button>
                </Cell>
              </Row>
            ))}
            {!isSolo && members.length < 3 && (
              <Row n={rowCounter.next()}>
                <Cell span={3}>
                  <button
                    type="button"
                    onClick={addMember}
                    className="w-full px-3 py-2 text-left font-mono text-xs text-neutral-500 hover:text-neutral-300"
                  >
                    + Insert row \u00b7 add teammate ({members.length}/3)
                  </button>
                </Cell>
              </Row>
            )}
          </>
        )}

        {activeTab === 'eligibility' && (
          <>
            <Row n={rowCounter.next()}>
              <Cell span={3} error={!!fieldErrors.ageConfirmed}>
                <ToggleField
                  checked={values.ageConfirmed}
                  onChange={(v) => setField('ageConfirmed', v)}
                  onFocusField={() => setFocusedField('ageConfirmed')}
                  label="I confirm I am 18\u201335 years old at time of application"
                />
              </Cell>
            </Row>
            <Row n={rowCounter.next()}>
              <Cell span={3} error={!!fieldErrors.portfolioLink}>
                <input
                  value={values.portfolioLink}
                  onChange={(e) => setField('portfolioLink', e.target.value)}
                  onFocus={() => setFocusedField('portfolioLink')}
                  placeholder="Portfolio / GitHub / LinkedIn link"
                  className={inputClass}
                />
              </Cell>
            </Row>
            <Row n={rowCounter.next()}>
              <Cell span={3} error={!!fieldErrors.workHistory}>
                <textarea
                  value={values.workHistory}
                  onChange={(e) => setField('workHistory', e.target.value)}
                  onFocus={() => setFocusedField('workHistory')}
                  rows={3}
                  placeholder="Brief work history or relevant past projects"
                  className={`${inputClass} resize-none`}
                />
              </Cell>
            </Row>
          </>
        )}
      </div>

      {/* Sheet tabs + status bar */}
      <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-2 py-1.5">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`rounded-t px-3 py-1.5 font-mono text-xs transition ${
                activeTab === t
                  ? 'border-t-2 border-red-600 bg-neutral-925 text-neutral-200'
                  : 'text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-300'
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

      <button
    type="submit"
    disabled={status === 'submitting'}
    className="mr-1 rounded-md bg-[#0f2a52] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#163a6e] disabled:opacity-50"
    >
    {status === 'submitting' ? 'Saving\u2026' : isLastTab ? 'Register team' : 'Next'}
    </button>
      </div>

      {status === 'error' && serverError && (
        <p className="border-t border-neutral-800 bg-red-950/30 px-4 py-2 text-center text-xs text-red-400">
          {serverError}
        </p>
      )}
      {status === 'success' && (
        <p className="border-t border-neutral-800 bg-emerald-950/20 px-4 py-2 text-center text-xs text-emerald-400">
          You're in \u2014 check your email for confirmation and kickoff details.
        </p>
      )}
    </form>
  );
}

const inputClass =
  'w-full bg-transparent px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none';

function HeaderRow({ n, label }: { n: number; label: string }) {
  return (
    <div className="grid grid-cols-[40px_1fr] md:grid-cols-[40px_repeat(3,1fr)]">
      <div className="flex items-center justify-center border-r border-neutral-800 bg-neutral-900/60 py-2 font-mono text-[10px] text-neutral-600">
        {n}
      </div>
      <div className="col-span-1 bg-neutral-900/60 px-3 py-2 font-mono text-[11px] font-semibold tracking-wider text-neutral-400 md:col-span-3">
        {label}
      </div>
    </div>
  );
}

function Row({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[40px_1fr] md:grid-cols-[40px_repeat(3,1fr)]">
      <div className="flex items-center justify-center border-r border-neutral-800 py-1 font-mono text-[10px] text-neutral-700">
        {n}
      </div>
      <div className="grid grid-cols-1 md:col-span-3 md:grid-cols-3">{children}</div>
    </div>
  );
}

function Cell({
  span,
  error,
  children,
}: {
  span: number;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative border-b border-r border-neutral-800 last:border-r-0 focus-within:z-10 focus-within:ring-1 focus-within:ring-[#1a73e8] md:border-b-0 ${
        span >= 3 ? 'md:col-span-3' : span >= 1.5 ? 'md:col-span-1' : 'md:col-span-1'
      }`}
    >
      {children}
      {error && (
        <span className="absolute right-0 top-0 h-0 w-0 border-b-[7px] border-l-[7px] border-b-transparent border-l-red-500" />
      )}
      <span className="pointer-events-none absolute bottom-0 right-0 hidden h-1.5 w-1.5 bg-[#1a73e8] opacity-0 group-focus-within:opacity-100" />
    </div>
  );
}

function ToggleField({
  checked,
  onChange,
  onFocusField,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  onFocusField: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onFocus={onFocusField}
        className="h-4 w-4 rounded-sm border-neutral-700 bg-neutral-900 accent-red-600"
      />
      {label}
    </label>
  );
}

function SheetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
      <path d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8M8 15h8M8 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function useRowCounter() {
  let n = 1;
  return { next: () => n++ };
}