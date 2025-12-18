export async function integrationAgent(
  businessInfo: any,
  features: string[]
) {
  const integrations: any = {
    forms: [],
    payments: [],
    booking: null,
    analytics: null,
  };

  // Add contact form if requested
  if (features.includes("Contact Form")) {
    integrations.forms.push({
      type: "contact",
      html: generateContactForm(),
    });
  }

  // Add newsletter if requested
  if (features.includes("Newsletter")) {
    integrations.forms.push({
      type: "newsletter",
      html: generateNewsletterForm(),
    });
  }

  // Add Stripe integration for e-commerce
  if (features.includes("E-commerce")) {
    integrations.payments = {
      provider: "stripe",
      config: {
        publishableKey: "pk_test_placeholder",
      },
      note: "Replace with your Stripe publishable key",
    };
  }

  // Add booking system
  if (features.includes("Booking")) {
    integrations.booking = {
      type: "calendly",
      note: "Integrate with Calendly or similar booking system",
    };
  }

  // Add analytics
  integrations.analytics = {
    googleAnalytics: "<!-- Add your GA4 tracking code -->",
    note: "Add Google Analytics GA4 measurement ID",
  };

  return integrations;
}

function generateContactForm() {
  return `
    <form class="space-y-4 max-w-md mx-auto">
      <div>
        <label class="block text-sm font-medium mb-2">Name</label>
        <input type="text" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input type="email" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Message</label>
        <textarea rows="4" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"></textarea>
      </div>
      <button type="submit" class="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90">
        Send Message
      </button>
    </form>
  `;
}

function generateNewsletterForm() {
  return `
    <form class="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        required
        class="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
      />
      <button type="submit" class="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90">
        Subscribe
      </button>
    </form>
  `;
}
