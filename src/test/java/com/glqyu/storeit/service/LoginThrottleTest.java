package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginThrottleTest {

	@Test
	void blocksAfterFiveFailuresInsideTheWindowAndReleasesAfterwards() {
		AppProperties props = new AppProperties();
		props.getLogin().setMaxFailures(5);
		props.getLogin().setWindowMinutes(15);
		LoginThrottle throttle = new LoginThrottle(props);
		long start = 1_000_000L;

		for (int i = 0; i < 4; i++) {
			throttle.recordFailure("10.0.0.8\nalice", start);
		}
		assertThat(throttle.isBlocked("10.0.0.8\nalice", start)).isFalse();
		throttle.recordFailure("10.0.0.8\nalice", start);
		assertThat(throttle.isBlocked("10.0.0.8\nalice", start + 60)).isTrue();
		assertThat(throttle.isBlocked("10.0.0.8\nbob", start + 60)).isFalse();
		assertThat(throttle.isBlocked("10.0.0.8\nalice", start + 15 * 60)).isFalse();

		throttle.recordFailure("10.0.0.8\nalice", start);
		throttle.clear("10.0.0.8\nalice");
		assertThat(throttle.isBlocked("10.0.0.8\nalice", start)).isFalse();
	}
}
